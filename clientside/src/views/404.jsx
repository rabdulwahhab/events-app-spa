import { Link } from 'react-router-dom';

export default function Default() {
  return (
    <div>
      <h1>{"Page not found"}</h1>
      <Link to="/" className="btn btn-primary">{"Go home"}</Link>
    </div>
  );
}
