import { useState } from 'react';

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <FeedbackInput setGood={setGood} setNeutral={setNeutral} setBad={setBad}/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  );
}

const FeedbackInput = ({ setGood, setNeutral, setBad }) => {
  return (
    <div>
      <h2>Give feedback</h2>
      <div>
        <button onClick={() => setGood((good) => good + 1)}>Good</button>
        <button onClick={() => setNeutral((neutral) => neutral + 1)}>Neutral</button>
        <button onClick={() => setBad((bad) => bad + 1)}>Bad</button>
      </div>
    </div>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;
  const avg = (good * 1 + bad * -1) / all;
  const positive = (good * 100) / all;
  return (
    <ul>
      <li>Good: {good}</li>
      <li>Neutral: {neutral}</li>
      <li>Bad: {bad}</li>
      <li>All: {all}</li>
      <li>Average: {Number.isNaN(avg) ? 0 : avg}</li>
      <li>Positive: {Number.isNaN(positive) ? 0 : positive}%</li>
    </ul>
  );
};

export default App;