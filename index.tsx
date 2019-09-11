import React, { useRef, FormEvent, useState } from "react";
import { render } from "react-dom";

const Form: React.FC = () => {
  // input[type="file"] is readOnly, so we must use a reference
  const inputRef = useRef(null);
  // used to reset input after upload
  const [key, setKey] = useState(1);
  // display images from server
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement> | FormEvent<HTMLButtonElement>
  ) => {
    // stop reloading the page
    event.preventDefault();

    // ensure we actually have an image to upload
    if (!inputRef.current || !inputRef.current.files[0]) {
      return;
    }

    // For the browser to upload images we need to handle it as `encType=multipart/form-data`, not json
    const formData = new FormData();
    formData.append("image", inputRef.current.files[0]);
    formData.append("user", "1");

    // reset the file input
    setKey(key + 1);

    // Using formdata makes it incredibly easy to do the fetch request
    fetch("/image", {
      body: formData,
      method: "POST",
    })
      .then(res => res.json())
      .then(data => setImages(images.concat([data.url])))
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <>
      {images.map(image => (
        <img key={image} src={image} width="200" style={{ display: "block" }} />
      ))}
      <form key={key} onSubmit={handleSubmit}>
        <input type="file" ref={inputRef} />
        <button type="submit" onClick={handleSubmit}>
          Upload
        </button>
      </form>
    </>
  );
};

render(<Form />, document.getElementById("root"));
