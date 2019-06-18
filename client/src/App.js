import React from 'react';
import axios from 'axios';

import { Container } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: [
        { email: '', valid: true },
        { email: '', valid: true },
        { email: '', valid: true }
      ],
      isAddManyAtOnce: false,
      multiTextValid: true,
      multiTextArea: '',
      multiMails: [],
    }
  }

  validateEmail = (email) => {
    // eslint-disable-next-line no-useless-escape
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validateFunc = (formData) => {
    for (let i = 0; i < formData.length; i++) {
      formData[i].valid = this.validateEmail(formData[i].email);
    }
  }

  validateMultiFunc = (multiText) => {
    const text = multiText.split(',');
    const mailList = [];

    let valid = true;

    for (let i = 0; i < text.length; i++) {
      if (text[i] === '\r' || text[i] === '\r\n' || text[i] === '\n' || text[i] === '')
        continue;

      const mail = text[i].replace(/(\r\n|\n|\r)/gm, "");
      mailList.push(mail);
      if (valid === true) {
        valid = this.validateEmail(mail);
      }
    }

    this.setState({
      multiMails: mailList,
      multiTextValid: valid
    })
  }

  handleChange = (event) => {
    const { formData } = this.state;
    formData[parseInt(event.target.id.split('-')[1])].email = event.target.value;
    this.validateFunc(formData);
    this.setState({ formData });
  }

  addAnother = () => {
    const { formData } = this.state;
    formData.push({
      email: '',
      valid: true
    });
    this.setState({ formData });
  }

  addManyOnce = () => {
    this.setState({
      isAddManyAtOnce: true
    })
  }

  remove = (event) => {
    const { formData } = this.state;
    const index = parseInt(event.target.id.split('-')[1]);
    formData.splice(index, 1);
    this.setState({ formData });
  }

  multiTextAreaChange = (event) => {
    const multiTextArea = event.target.value;
    this.validateMultiFunc(multiTextArea);
    this.setState({
      multiTextArea
    })
  }

  submit = () => {
    const { formData } = this.state;
    const mailList = [];
    const emptyList = [];
    let bValid = true;

    for (let i = 0; i < formData.length; i++) {
      if (formData[i].email === '') {
        emptyList.push(i);
        continue;
      }

      mailList.push(formData[i].email);
      bValid = formData[i].valid;
    }

    for (let i = emptyList.length - 1; i >= 0; i--)
      formData.splice(emptyList[i], 1);

    if (bValid) {
      axios.post('/api/mail', {
        data: mailList
      })
        .then(res => {
          toast.success('Invitations Success!');
        })
        .catch(error => {
          toast.error('Invitations Failed!');
        });
    } else {
      toast.error('Input valied emails!');
    }

    this.setState({ formData });
  }

  addInvites = () => {
    axios.post('/api/mail', {
      data: this.state.multiMails
    })
      .then(res => {
        toast.success('Invitations Success!');
      })
      .catch(error => {
        toast.error('Invitations Failed!');
      });
  }

  cancel = () => {
    this.setState({
      isAddManyAtOnce: false
    })
  }

  render() {
    const { formData } = this.state;
    return (
      <div className="container marginTop">
        <Container>
          <div className="row">
            <div className="col-12 header-area">
              <h1>Invite Members</h1>
            </div>
          </div>
          {!this.state.isAddManyAtOnce ? (
            <div>
              <div className="row mt-4">
                <div className="col-5">
                  <h5>Email Address</h5>
                </div>
                <div className="col-5">
                  <h5>Name (Optional)</h5>
                </div>
              </div>
              {formData && formData.map((item, index) => {
                return (
                  <div key={index}>
                    <div className="row mt-2">
                      <div className="col-5">
                        <TextField
                          className="Text_Field_Style"
                          id={`email-${index}`}
                          value={formData[index].email}
                          onChange={this.handleChange}
                          placeholder="name@example.com"
                          variant="outlined"
                        />
                      </div>
                      <div className="col-5">
                        <TextField
                          className="Text_Field_Style"
                          placeholder="Optional"
                          variant="outlined"
                        />
                      </div>
                      <div className="col-2 icon_area">
                        <CloseIcon
                          className="remove-area"
                          id={`close-${index}`}
                          onClick={this.remove}
                        />
                      </div>
                    </div>
                    {formData[index].valid ? (null) : (
                      <div className="row valid-area">
                        <div className="col-5">
                          <p>Invalid email address</p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              <div className="row">
                <div className="add-area col-12 mt-4">
                  {formData.length && formData.length >= 6 ? (
                    <p className="mr-2 p-readonly">Add another</p>
                  ) : (
                      <p className="mr-2" onClick={this.addAnother}>Add another</p>
                    )}
                  or
                  <p className="ml-2" onClick={this.addManyOnce}>Add many at once</p>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    className="mt-4"
                    onClick={this.submit}
                  >
                    Send Invites
                  </Button>
                </div>
              </div>
            </div>
          ) : (
              <div>
                <div className="row mt-4">
                  <div className="col-12 multi-area">
                    <p className="text-multi-area-header">
                      Enter multiple email addresses
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 multi-area">
                    <TextField
                      className="text-multi-area"
                      id="outlined-multiline-static"
                      value={this.state.multiTextArea}
                      multiline
                      rows="4"
                      margin="normal"
                      variant="outlined"
                      onChange={this.multiTextAreaChange}
                    />
                  </div>
                </div>
                {this.state.multiTextValid ? (null) : (
                  <div className="row valid-area">
                    <div className="col-12">
                      <p>Invalid email address</p>
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-12 multi-area">
                    <p className="tip-area-bold">Tip: </p>
                    <p className="tip-area">
                      Copy and paste a list of contacts from your email. Please seperate multiple addresses with commas!
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <Button
                      color="primary"
                      variant="contained"
                      type="submit"
                      className="mt-4 mr-4"
                      onClick={this.addInvites}
                    >
                      Add Invites
                    </Button>
                    <Button
                      color="default"
                      variant="contained"
                      type="submit"
                      onClick={this.cancel}
                      className="mt-4"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
        </Container>
        <ToastContainer />
      </div >
    );
  }
}