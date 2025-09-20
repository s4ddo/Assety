import React from "react";
import MeshCanvas from "./glb-viewer";


export function parseForImage(text) {
  return text.flatMap((item) => {
    if (typeof item !== "string") return [item];

    const parts = [];
    let lastIndex = 0;
    let match;
    const regex = /<img src="([^"]+)">/g;

    while ((match = regex.exec(item)) !== null) {
      const before = item.slice(lastIndex, match.index);
      if (before) parts.push(before);

      const filename = match[1]; // e.g. "image.png"
      const imageUrl = `https://horribly-mighty-goshawk.ngrok-free.app/get-image/${filename}`; // fetch from Flask endpoint

      parts.push(
        <img
          key={match.index}
          src={imageUrl}
          alt={filename}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      );

      lastIndex = regex.lastIndex;
    }

    const after = item.slice(lastIndex);
    if (after) parts.push(after);

    return parts.length > 0 ? parts : [item];
  });
}


export function parseForMesh(text) {
  return text.flatMap((item) => {
    if (typeof item !== "string") return [item];

    const parts = [];
    let lastIndex = 0;
    let match;
    const regex = /<mesh src="([^"]+)">/g;

    while ((match = regex.exec(item)) !== null) {
      const before = item.slice(lastIndex, match.index);
      if (before) parts.push(before);

      const filename = match[1]; // e.g., "model.glb"
      const meshUrl = `https://horribly-mighty-goshawk.ngrok-free.app/get-mesh/${filename}`; // full URL to endpoint

      parts.push(<MeshCanvas key={match.index} meshUrl={meshUrl} />);

      lastIndex = regex.lastIndex;
    }

    const after = item.slice(lastIndex);
    if (after) parts.push(after);

    return parts.length > 0 ? parts : [item];
  });
}


export function parseForAudio(text) {
  return text.flatMap((item) => {
    if (typeof item !== "string") return [item];

    const parts = [];
    let lastIndex = 0;
    let match;
    const regex = /<audio src="([^"]+)">/g;

    while ((match = regex.exec(item)) !== null) {
      const before = item.slice(lastIndex, match.index);
      if (before) parts.push(before);

      const filename = match[1];
      const audioUrl = `https://horribly-mighty-goshawk.ngrok-free.app/get-music/${filename}`; // full URL to endpoint

      parts.push(
        <audio key={match.index} controls>
          <source src={audioUrl} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      );

      lastIndex = regex.lastIndex;
    }

    const after = item.slice(lastIndex);
    if (after) parts.push(after);

    return parts.length > 0 ? parts : [item];
  });
}



export function parseMedia(text) {
  text = parseForAudio(text);
  text = parseForMesh(text);
  text = parseForImage(text);
  return text
}
// export function parseText(text){
//   text = 

//   return text
// }