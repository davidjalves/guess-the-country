/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { getCountryCodes, getImage } from "../utils/API/imagesAPI";
import { Button, Card, Col, Image } from "react-bootstrap";
import OtpInput from "react-otp-input";
export const Home = () => {
  const [iniciar, setIniciar] = useState(false);
  const [helpText, setHelpText] = useState("");
  const [inputText, setInputText] = useState("");
  const [hiddenHelp, setHiddenHelp] = useState(true);
  const [choosedCountry, setChoosedCountry] = useState({});
  const [imageData, setImageData] = useState("");
  const [seconds, setSeconds] = useState(120);
  const [correct, setCorrect] = useState("");

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

  const loadCountry = async () => {
    let countryc = await getCountryCodes();
    let randnumber = await randomNumber(0, Object.keys(countryc).length - 1);
    Object.keys(countryc).map((code, index) => {
      if (index === randnumber && !code.startsWith("us-")) {
        let obj = {
          code: code,
          name: countryc[code]
            .replace(/\s/g, "")
            .replace(",", "")
            .toUpperCase(),
        };
        setChoosedCountry(obj);
        loadImage(code);
      } else if (
        index === randnumber &&
        (code.startsWith("us-") || countryc[code].length > 20)
      ) {
        setChoosedCountry({});
        loadCountry();
      }
    });
  };
  const loadImage = async (code) => {
    let img = await getImage(`https://flagcdn.com/256x192/${code}.png`);
    let base64img = btoa(String.fromCharCode(...new Uint8Array(img)));
    setImageData(base64img);
  };
  const handleHelp = () => {
    let randnumber = randomNumber(0, choosedCountry.name.length);
    if (helpText === "") {
      helpword = "-".repeat(choosedCountry.name.length);
    }
    if (helpText !== "") {
      helpword = helpText;
    }
    console.log("rand", randnumber);
    if (helpText !== choosedCountry.name) {
      for (let letter = 0; letter < choosedCountry.name.length; letter++) {
        if (letter === randnumber && helpword !== "") {
          console.log(helpword[letter]);
          if (helpword[letter] === "-") {
            console.log("entrou");
            console.log(helpword);
            helpword = replaceAt(helpword, letter, choosedCountry.name[letter]);
            console.log(helpword);
            setHelpText(helpword);
          } else {
            console.log("igual");
            handleHelp();
          }
        } else {
          if (helpword[letter] !== choosedCountry.name[letter]) {
            helpword = replaceAt(helpword, letter, "-");
            setHelpText(helpword);
          }
        }
      }
    }
    if (helpText === choosedCountry.name) {
      console.log("It already filled all spaces");
    }
  };

  const verifyAnswer = () => {
    if (inputText.toUpperCase() === choosedCountry.name) {
      setCorrect(true);

      setTimeout(() => {
        loadCountry();
        setInputText("");
        setHelpText("");
        setCorrect("");
      }, 1000);
    } else {
      setCorrect(false);
    }
  };
  useEffect(() => {
    loadCountry();
  }, []);

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      console.log("end");
    }
  });
  return (
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
          color: "#8d4303",
          fontSize: 60,
          display: "flex",
          paddingLeft: "2mm",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Guess the country
      </div>
      <div
        className="font-link"
        style={{
          fontSize: 60,
          color: "#8d4303",

          display: "flex",
          paddingLeft: "2mm",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {`${Math.floor(seconds / 60)
          .toString()
          .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`}
      </div>
      <center>
        {Object.keys(choosedCountry).length > 0 && (
          <>
            <Image src={`data:image/png;base64,${imageData}`}></Image>
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
                  fontSize: 60,
                  color: "transparent",
                }}
              >&bnsp;</div>
            )}
            {hiddenHelp === false && (
              <OtpInput
                isDisabled
                containerStyle={{
                  marginTop: "20px",
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
                marginTop: hiddenHelp === false ? "-65px" : "20px",
                paddingBottom: "2mm",
                backgroundColor: hiddenHelp === false ? "transparent" : "",
                display: "flex",
                paddingLeft: "2mm",
                alignItems: "center",
                justifyContent: "center",
              }}
              inputStyle={{
                color: "black",
                fontSize: 40,
                backgroundColor: hiddenHelp === false ? "transparent" : "",
              }}
              value={inputText}
              onChange={(otp) => {
                console.log(otp);
                setInputText(otp);
              }}
              numInputs={choosedCountry.name.length}
              separator={<span></span>}
            />
            <br></br>

            <Button
              onClick={() => {
                verifyAnswer();
              }}
              variant="success"
            >
              CONFIRM
            </Button>
            <Button
              onClick={() => {
                setHiddenHelp(!hiddenHelp);
              }}
            >
              {hiddenHelp === true ? "SHOW HINT" : "HIDE HINT"}
            </Button>
            <Button
              onClick={() => {
                handleHelp();
              }}
            >
              NEW HINT
            </Button>
          </>
        )}
      </center>      
      <center>David Ressurreição &copy; {new Date().getFullYear()}</center>

    </div>
  );
};
