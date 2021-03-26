import { Link } from 'react-router-dom';

export default function Default() {
  return (
    <div>
      <h3 className="fw-lighter display-3 my-3">{"Page not found"}</h3>
      <Link to="/" className="btn btn-primary">{"Go home"}</Link>
    </div>
  );
}
