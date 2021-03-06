import React from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { Link } from "react-router-dom";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      errorMessage: "",
      successMessage: "",
    };
  }

  // Fetch the data from An External API
  componentDidMount() {
    axios
      .get("http://localhost:8000/exercises")
      .then((response) => {
        this.setState({ exercises: response.data });
      })
      .catch((error) => {
        console.log(error.response);
        if (error.response.status === 404) {
          this.setState({
            errorMessage: "Movie with the supplied id does not exist",
          });
        }
      });
  }

  // Disappear successMessage after 3000sec.
  componentDidUpdate() {
    setTimeout(() => this.setState({ successMessage: "" }), 3000);
  }

  handleDelete(id) {
    axios
      .delete(`http://localhost:8000/exercises/${id}`)
      .then((response) => {
        this.setState({
          exercises: [...this.state.exercises].filter(
            (exercise) => exercise._id !== id
          ),
          successMessage: "Exercise deleted successfully",
        });
      })
      .catch((error) => {
        console.log(error.response);
        if (error.response.status === 400) {
          this.setState({
            errorMessage: "Bad request",
          });
        } else if (error.response.status === 404) {
          this.setState({
            errorMessage: "Not found",
          });
        }
      });
  }

  render() {
    const { exercises } = this.state;
    const { errorMessage } = this.state;
    const { successMessage } = this.state;
    return (
      <>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <h3>List of exercises</h3>
        <p style={{ color: "red" }}>{errorMessage}</p>
        <p style={{ color: "green" }}>{successMessage}</p>
        <table border="1">
          <thead>
            <tr>
              <th>Username</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((exercise) => (
              <tr key={exercise._id}>
                <td>{exercise.username}</td>
                <td>{exercise.description}</td>
                <td>{exercise.duration}</td>
                <td>{exercise.date.substring(0, 10)}</td>
                <td>
                  <Link to={`/Details/${exercise._id}`}>
                    <button type="submit">Details</button>
                  </Link>
                  <Link to={`/Edit/${exercise._id}`}>
                    <button type="submit">Edit</button>
                  </Link>
                  <button
                    type="submit"
                    onClick={() => this.handleDelete(exercise._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
}

export default Home;
