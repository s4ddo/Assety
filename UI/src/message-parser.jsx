import React from "react";
import MeshCanvas from "./glb-viewer";


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

      const meshUrl = match[1];
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

      const audioUrl = match[1];
      parts.push(
        <audio key={match.index} controls>
          <source src={audioUrl} type="audio/mpeg" />
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
  return text
}
// export function parseText(text){
//   text = 

//   return text
// }