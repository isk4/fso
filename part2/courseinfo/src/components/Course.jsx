const Course = ({ course: { name, parts } }) => {  
  return (
    <div>
      <Header courseName={name}/>
      <Content parts={parts}/>
      <hr />
      <Total parts={parts}/>
    </div>
  );
};

const Header = ({ courseName }) => {
  return (<h1>{courseName}</h1>);
}

const Content = ({ parts }) => {
  return (
    <div>
      { parts.map((part) => {
        return <Part part={part} key={part.id} />
      }) }
    </div>
  );
}

const Part = ({ part: {name, exercises} }) => {
  return (<p>{name} {exercises}</p>);
}

const Total = ({ parts }) => {
  let numberOfExercises = parts.reduce((total, { exercises }) => total + exercises, 0);
  return (<p><b>Number of exercises {numberOfExercises}</b></p>);
}


export default Course;