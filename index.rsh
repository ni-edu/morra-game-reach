'reach 0.1';
// makeEnum https://docs.reach.sh/rsh/compute/#makeenum
const [ isResult, DRAW, ALICE_WINS, BOB_WINS, NO_RESULT ] = makeEnum(4);

const selectWinner = (fingerBob, fingerAlice, numberBob, numberAlice) => {
 const totalFingers = fingerAlice + fingerBob;
 if((totalFingers == numberBob) && (totalFingers == numberAlice)){
  return 0;
 }
 else if(totalFingers == numberAlice){
  return 1;
 }
 else if(totalFingers == numberBob){
  return 2;
 }
 else{
  return 3;
 }
}

const MorraPlayer = {
  ...hasRandom,
  getFingers: Fun([], UInt),
  sayNumber: Fun([], UInt),
  showResult: Fun([UInt], Null), // return true if there is a result otherwise will return false
  // confirmTimeOut: Fun([UInt], Null)
} 

export const main = Reach.App(() => {
  // USE API later
  // const MP = API('MorraPlayer', {
  //   ...hasRandom,
  //   showFingers: Fun([], UInt),
  //   tellNumber: Fun([], UInt),
  //   showResult: Fun([UInt], Null)
  // });
  const deadline = 10;
  
  

  const Alice = Participant('Alice', {
    ...MorraPlayer,
  });

  const Bob = Participant('Bob', {
    ...MorraPlayer,
  });
 
  init();

  // const confirmTimeOut = () => {
  //   each([Alice, Bob], () => {
  //     interact.confirmTimeOut();
  //   });
  // };
  Alice.publish();
  commit();
  Bob.publish();

  var result = DRAW;
  invariant(balance() == 0 && isResult(result))
  while (result == DRAW || result == NO_RESULT) {
    commit();
    Alice.only(() => {
      const _fingersAlice = interact.getFingers();
      const [_commitFingerAlice, _saltFingerAlice] = makeCommitment(interact, _fingersAlice);
      const commitFingerAlice = declassify(_commitFingerAlice);
    });
    Alice.publish(commitFingerAlice);
    commit();
    Bob.only(() => {
      const _fingersBob = interact.getFingers();
      const [_commitFingerBob, _saltFingerBob] = makeCommitment(interact, _fingersBob);
      const commitFingerBob = declassify(_commitFingerBob);
    });
    Bob.publish(commitFingerBob);
    commit();
    Alice.only(() => {
      const _numberAlice = interact.sayNumber();
      const [_commitNumberAlice, _saltNumberAlice] = makeCommitment(interact, _numberAlice);
      const commitNumberAlice = declassify(_commitNumberAlice);
    });
    Alice.publish(commitNumberAlice);

    commit();
    Bob.only(() => {
      const numberBob = declassify(interact.sayNumber());
    });
    Bob.publish(numberBob);
    commit();

    Alice.only(() => {
      const saltFingerAlice = declassify(_saltFingerAlice);
      const fingerAlice = declassify(_fingersAlice);
    });
    
    Alice.publish(saltFingerAlice, fingerAlice);
    checkCommitment(commitFingerAlice, saltFingerAlice, fingerAlice);
    commit();

    Bob.only(() => {
      const saltFingerBob = declassify(_saltFingerBob);
      const fingerBob = declassify(_fingersBob);
    });
    Bob.publish(saltFingerBob, fingerBob);
    checkCommitment(commitFingerBob, saltFingerBob, fingerBob);
    commit();

    Alice.only(() => {
      const saltNumberAlice = declassify(_saltNumberAlice);
      const numberAlice = declassify(_numberAlice);
    });
    Alice.publish(saltNumberAlice, numberAlice);
    checkCommitment(commitNumberAlice, saltNumberAlice, numberAlice);
    const currentResult = selectWinner(fingerBob, fingerAlice, numberBob, numberAlice);
    if(currentResult == ALICE_WINS){
      commit();
      const payment = 10000 +(fingerAlice+fingerBob) * 10000;
      Bob.pay(payment);
      transfer(payment).to(Alice);
    }
    else if(currentResult == BOB_WINS){
      commit();
      const payment = 10000 + (fingerAlice+fingerBob) * 10000;
      Alice.pay(payment);
      transfer(payment).to(Bob);
    }
    each([Alice, Bob], () => {
      interact.showResult(currentResult);
    });
    result = currentResult;
    continue;
  }

  assert(result == ALICE_WINS || result == BOB_WINS);
  commit();

  

  // write your program here
  exit();
});
