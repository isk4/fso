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
        <Button text="Good" setter={setGood} />
        <Button text="Neutral" setter={setNeutral} />
        <Button text="Bad" setter={setBad} />
      </div>
    </div>
  );
};

const Button = ({ text, setter }) => {
  return (
    <button onClick={() => setter((count) => count + 1)}>{text}</button>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;
  if (all === 0) {
    return <p>No feedback given.</p>;
  }

  const avg = (good * 1 + bad * -1) / all;
  const positive = (good * 100) / all;
  return (
    <table>
      <tbody>
        <StatisticLine text="Good" value={good} />
        <StatisticLine text="Neutral" value={neutral} />
        <StatisticLine text="Bad" value={bad} />
        <StatisticLine text="All" value={all} />
        <StatisticLine text="Average" value={Number.isNaN(avg) ? 0 : avg.toFixed(2)} />
        <StatisticLine text="Positive" value={Number.isNaN(positive) ? 0 : positive.toFixed(2)} />
      </tbody>
    </table>
  );
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}{text === "Positive" && " %"}</td>
    </tr>
  );
};

export default App;