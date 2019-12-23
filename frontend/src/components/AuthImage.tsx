import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getToken } from "../services/auth/auth.service";

type Props = {
  file_url: string;
};

const AuthImage = (props: Props) => {
  const { file_url } = props;

  const [isLoading, setIsLoading] = useState(true);
  const fileData = useRef("");

  // const reader = new FileReader();

  useEffect(() => {
    axios
      .get(`http://localhost:4000${file_url}`, {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })
      .then(response => {
        // fileData = new Bloresponse.data;
        fileData.current = Buffer.from(response.data, "binary").toString(
          "base64"
        );
        // fileData.current.readAsDataURL(new Blob(response.data));
        setIsLoading(false);
      });
  }, [file_url]);

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <img src={`data:image/jpeg;base64,${fileData.current}`} alt="The receipt" />
  );
};

export default AuthImage;
