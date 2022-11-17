import React from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
}
  from 'mdb-react-ui-kit';
import { NavLink } from "react-router-dom";
import '../css/login.css';
import { Button } from "reactstrap";
const Login = () => {
  return (
    <div className="login">

      <MDBContainer fluid style={{ height: '40rem'}}>

        <MDBRow className='d-flex justify-content-center align-items-center h-100'>
          <MDBCol col='12'>

            <MDBCard className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '500px' }}>
              <MDBCardBody className='p-5 w-500 d-flex flex-column'>

                <h2 className="fw-bold mb-2 text-center">Sign in</h2>

                <MDBInput wrapperClass='mb-4 w-100' placeholder="Email" id='formControlLg' type='email' size="lg" />
                <MDBInput wrapperClass='mb-4 w-100' placeholder="Password" id='formControlLg' type='password' size="lg" />
                <hr className="my-2" />
                <NavLink className="navbar-brand ps-2" to="/register" >Đã có tài khoản?</NavLink>
                <hr className="my-2" />
                <Button color="primary">
                  Sign in
                </Button>
              </MDBCardBody>
            </MDBCard>

          </MDBCol>
        </MDBRow>

      </MDBContainer>
    </div>
  );
}

export default Login;