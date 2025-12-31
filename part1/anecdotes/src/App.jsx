import { useState, useMemo } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ];

  const getRandomNumber = (upperLimit) => {
    return Math.floor(Math.random() * upperLimit);
  };
  const generateVotesObject = () => {
    const obj = {};
    for (const i of anecdotes.keys()) obj[i] = 0;
    // { "0": 0, "1": 0, "2": 0, "3": 0, ... }
    return obj;
  };
  
  const [selected, setSelected] = useState(getRandomNumber(anecdotes.length));
  const [votes, setVotes] = useState(generateVotesObject());
  const mostVoted = useMemo(() => {
    const votesKeys = Object.keys(votes);
    return votesKeys.reduce((mostVoted, current) => votes[current] > votes[mostVoted] ? current : mostVoted);
  }, [votes]);

  const handleNextClick = () => {
    let newSelected = getRandomNumber(anecdotes.length);
    // prevent selecting the same anecdote twice in a row
    while (newSelected === selected) newSelected = getRandomNumber(anecdotes.length);
    setSelected((_) => newSelected);
  };

  const handleVoteClick = () => {
    setVotes((votes) => ({ ...votes, [selected]: votes[selected] + 1 }));
  };

  return (
    <div>
      <div>
        <h2>Anecdote of the day</h2>
        <p>{anecdotes[selected]}</p>
        <p>Has {votes[selected]} votes</p>
        <button onClick={handleVoteClick}>Vote</button>
        <button onClick={handleNextClick}>Next anecdote</button>
      </div>
      <div>
        <h2>Anecdote with most votes</h2>
        { votes[mostVoted] === 0 ?
          <>
            <p>There are no votes yet</p>
          </> 
          : 
          <>
            <p>{anecdotes[mostVoted]}</p>
            <p>Has {votes[mostVoted]} votes</p>
          </>
        }
      </div>
    </div>
  );
}

export default App;