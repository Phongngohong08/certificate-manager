import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <div className="jumbotron d-flex align-items-center">
        <div className="container text-center">
          <h1>University Certificates on Blockchain</h1>
          <p>This web application demonstrates educational certificate management platform using <strong>Hyperledger Fabric</strong> & <strong>Nodejs</strong></p>
          <p>
            <Link className="btn btn-primary btn-md" to="/verify" role="button">
              Verify Certificates &raquo;
            </Link>
          </p>
        </div>
      </div>

      <div id="jumbotron-index" className="container marketing">
        <div className="row">
          <div className="col-lg-6 text-center">
            <h2>Students</h2>
            <p>Students can use our platform to manage and share their certificates.</p>
            <p>
              <Link className="btn btn-primary" to="/student/login" role="button">Sign In &raquo;</Link>
              <Link className="btn btn-primary ml-2" to="/student/register" role="button">Register &raquo;</Link>
            </p>
          </div>
          <div className="col-lg-6 text-center">
            <h2>Universities</h2>
            <p>Universities can use our platform to issue certificates to their students</p>
            <p>
              <Link className="btn btn-primary" to="/university/login" role="button">Sign In &raquo;</Link>
              <Link className="btn btn-primary ml-2" to="/university/register" role="button">Register &raquo;</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 