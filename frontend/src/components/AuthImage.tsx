import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getToken } from "../services/auth/auth.service";

export const MEDIA_URL =
  process.env.REACT_APP_MEDIA_SERVER_URL || "http://localhost:4000";

type Props = {
  file_url: string;
};

const AuthImage = (props: Props) => {
  const { file_url } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const fileData = useRef("");

  // const reader = new FileReader();

  useEffect(() => {
    axios
      .get(`${MEDIA_URL}${file_url}`, {
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
      })
      .catch(error => {
        setError(error.message);
      });
  }, [file_url]);

  if (error !== "") {
    return <div>IMAGE ERROR #rIVwbz: {error}</div>;
  }

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <img
        style={{ maxWidth: "600px", maxHeight: "400px" }}
        src={`data:image/jpeg;base64,${fileData.current}`}
        alt="The receipt"
      />
    </div>
  );
};

export default AuthImage;
