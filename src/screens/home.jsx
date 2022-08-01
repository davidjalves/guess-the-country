/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { getCountryCodes } from "../utils/API/imagesAPI";
import {
  Button,
  Card,
  Col,
  Image,
  OverlayTrigger,
  Popover,
  Row,
} from "react-bootstrap";
import OtpInput from "react-otp-input";
export const Home = () => {
  const time_seconds = 60;
  const max_word_size = 10;
  const [newRecord, setNewRecord] = useState(false);
  const [helpText, setHelpText] = useState("");
  const [inputText, setInputText] = useState("");
  const [hiddenHelp, setHiddenHelp] = useState(true);
  const [choosedCountry, setChoosedCountry] = useState({});
  //   const [imageData, setImageData] = useState("");
  const [seconds, setSeconds] = useState(time_seconds);
  const [correct, setCorrect] = useState("");
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [codes, setCodes] = useState({});
  const [start, setStart] = useState(false);
  var helpword;
  // Function to generate random number
  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  function replaceAt(string, index, replacement) {
    return (
      string.substring(0, index) +
      replacement +
      string.substring(index + replacement.length)
    );
  }
  const loadCodes = async () => {
    let countryc = await getCountryCodes();
    setCodes(countryc);
  };
  const loadCountry = () => {
    let randnumber = randomNumber(0, Object.keys(codes).length - 1);
    Object.keys(codes).map((code, index) => {
      if (index === randnumber && !code.startsWith("us-")) {
        let obj = {
          code: code,
          name: codes[code]
            .replace(/\s/g, "")
            .replace(",", "")
            .replace("ç", "c")
            .replace("é", "a")
            .replace("á", "a")
            .replace("ã", "a")
            .replace("â", "a")
            .toUpperCase(),
        };
        setChoosedCountry(obj);
      }
      if (
        index === randnumber &&
        (code.startsWith("us-") || codes[code].length > max_word_size)
      ) {
        setChoosedCountry({});
        loadCountry();
      }
    });
  };

  const handleHelp = () => {
    let randnumber = randomNumber(0, choosedCountry.name.length);
    if (helpText === "") {
      helpword = "*".repeat(choosedCountry.name.length);
    }
    if (helpText !== "") {
      helpword = helpText;
    }
    if (helpText !== choosedCountry.name) {
      for (let letter = 0; letter < choosedCountry.name.length; letter++) {
        if (letter === randnumber && helpword !== "") {
          if (helpword[letter] === "*") {
            helpword = replaceAt(helpword, letter, choosedCountry.name[letter]);
            setHelpText(helpword);
          } else {
            handleHelp();
          }
        } else {
          if (helpword[letter] !== choosedCountry.name[letter]) {
            helpword = replaceAt(helpword, letter, "*");
            setHelpText(helpword);
          }
        }
      }
    }
  };

  const verifyAnswer = () => {
    if (inputText.toUpperCase() === choosedCountry.name) {
      setCorrect(true);
      let newhelpword = "";
      if (helpText.length > 0) {
        newhelpword = helpText.split("*").join("");
      }
      setScore(
        (prev) => prev + 5 * choosedCountry.name.length - newhelpword.length * 2
      );
      setInputText("");
      setHelpText("");
      setTimeout(() => {
        setCorrect("");
        loadCountry();
      }, 1000);
    } else {
      setCorrect(false);
    }
  };
  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <b>For every correct answer:</b> <br></br>+ ( 5 x length of word) points
        <br></br>
        <b>For every hint used:</b> <br></br> - 2 points
      </Popover.Body>
    </Popover>
  );

  useEffect(() => {
    loadCodes();

    if (Number(JSON.parse(window.localStorage.getItem("record"))) > 0) {
      setMaxScore(JSON.parse(window.localStorage.getItem("record")));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("record", JSON.stringify(`${maxScore}`));
  }, [maxScore]);

  useEffect(() => {
    if (seconds > 0 && start === true) {
      setTimeout(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else {
      //end
      if (Number(score) > Number(maxScore)) {
        setMaxScore(score);
        setNewRecord(true);
      }
    }
  }, [seconds, start]);

  return (
    <>
      <div
        style={{
          paddingLeft: "5mm",
          paddingRight: "10mm",
          textAlign: "justify",
          textJustify: "inter-word",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className="font-link"
          style={{
            fontSize: 45,
            display: "flex",
            paddingLeft: "2mm",
            alignContent:"center",
            justifyContent:"center"
           
          }}
        >
          Guess the country
        </div>
        {start === false && (
          <div
            style={{
              display: "flex",
              paddingBottom: "12mm",
             alignContent:"center",
             justifyContent:"center"
              
            }}
          >
            <Button
              onClick={() => {
                setStart(true);
                loadCountry();
              }}
            >
              < div className="font-link" style={{ fontSize: 20 }}>
                {" "}
                START
              </div >
            </Button>
          </div>
        )}
        {seconds === 0 && start === true && (
          <Card >
            <Card.Title>
              <center className="font-link" style={{ fontSize: 30 }}>
                GAME OVER
              </center>
            </Card.Title>
            <Card.Body >
              <center className="font-link" style={{ fontSize: 30 }}>
                Your score in this game: {score} points<br></br>Your highest
                score: {maxScore} points
                <br></br>
                {newRecord === true && (
                  <div style={{ color: "green" }}>NEW RECORD!</div>
                )}
                <br></br>
                <br></br>
                <Row>
                  <Button
                    as={Col}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignContent: "center",
                      flexDirection: "column",
                    }}
                    variant="success"
                    onClick={() => {
                      setInputText("");
                      loadCountry();
                      setSeconds(time_seconds);
                      setHelpText("");
                      setCorrect("");
                      setScore(0);
                      setNewRecord(false);
                    }}
                  >
                    {" "}
                    <div className="font-link" style={{ fontSize: 20 }}>
                      {" "}
                      RESTART GAME
                    </div>
                  </Button>

                  <OverlayTrigger
                    trigger="click"
                    placement="top"
                    overlay={popover}
                  >
                    <Button
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignContent: "center",
                        flexDirection: "column",
                      }}
                      as={Col}
                      variant="primary"
                      onClick={() => {}}
                    >
                      {" "}
                      <div className="font-link" style={{ fontSize: 20 }}>
                        HOW POINTS ARE CALCULATED
                      </div>
                    </Button>
                  </OverlayTrigger>
                </Row>
              </center>
            </Card.Body>
          </Card>
        )}
        {seconds > 0 && start === true && (
          <>
            <div
              className="font-link"
              style={{
                fontSize: 45,

                display: "flex",
                paddingLeft: "2mm",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {`${Math.floor(seconds / 60)
                .toString()
                .padStart(2, "0")}:${(seconds % 60)
                .toString()
                .padStart(2, "0")}`}
            </div>
            <center>
              {Object.keys(choosedCountry).length > 0 && (
                <>
                  <Image
                  height={"120px"}
                    src={`https://flagcdn.com/256x192/${choosedCountry.code}.png`}
                  ></Image>

                  {correct !== "" && (
                    <div>
                      {correct === true ? (
                        <div
                          style={{
                            fontSize: 60,
                            color: "green",
                          }}
                        >
                          ✓
                        </div>
                      ) : (
                        <div
                          style={{
                            fontSize: 60,
                            color: "red",
                          }}
                        >
                          ❌
                        </div>
                      )}
                    </div>
                  )}
                  {correct === "" && (
                    <div
                      style={{
                        color: "transparent",
                        height: "90px",
                      }}
                    ></div>
                  )}
                  {hiddenHelp === false && (
                    <OtpInput
                      isDisabled
                      containerStyle={{
                        marginTop: "10px",
                        display: "flex",
                        paddingLeft: "2mm",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      inputStyle={{ color: "gray", fontSize: 40 }}
                      value={helpText}
                      numInputs={choosedCountry.name.length}
                      separator={<span></span>}
                    />
                  )}

                  <OtpInput
                    containerStyle={{
                      marginTop: hiddenHelp === false ? "-65px" : "10px",
                      paddingBottom: "2mm",
                      backgroundColor:
                        hiddenHelp === false ? "transparent" : "",
                      display: "flex",
                      paddingLeft: "2mm",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    inputStyle={{
                      color: "black",
                      fontSize: 40,
                      backgroundColor:
                        hiddenHelp === false ? "transparent" : "",
                    }}
                    value={inputText}
                    onChange={(otp) => {
                      setInputText(otp);
                    }}
                    numInputs={choosedCountry.name.length}
                    separator={<span></span>}
                  />
                  <br></br>
                  <Button
                  style={{margin:"2mm"}}
                    onClick={() => {
                      verifyAnswer();
                    }}
                    variant="success"
                  >
                    {" "}
                    <div className="font-link" style={{ fontSize: 20 }}>
                      {" "}
                      CONFIRM
                    </div>
                  </Button>
                  <Button
                   style={{margin:"2mm"}}
                    onClick={() => {
                      setHiddenHelp(!hiddenHelp);
                    }}
                  >
                    {hiddenHelp === true ? (
                      <div className="font-link" style={{ fontSize: 20  }}>
                        SHOW HINTS
                      </div>
                    ) : (
                      <div className="font-link" style={{ fontSize: 20  }}>
                        HIDE HINTS
                      </div>
                    )}
                  </Button>
                  <Button
                   style={{margin:"2mm"}}
                    onClick={() => {
                      handleHelp();
                    }}
                  >
                    {" "}
                    <div className="font-link" style={{ fontSize: 20  }}>
                      NEW HINT
                    </div>
                  </Button>
                </>
              )}
            </center>
          </>
        )}
        {(start === false || (start === true && seconds === 0)) && (
          <>
            <center className="font-link" style={{ fontSize: 20 }}>
              The countries flags are provided by flagpedia.net API
            </center>
            <center className="font-link" style={{ fontSize: 30 }}>
              Made by{" "}
              <a
                href="https://github.com/davidjalves"
                style={{ color: "black" }}
              >
                David Ressurreição
              </a>
            </center>
          </>
        )}
      </div>
    </>
  );
};
