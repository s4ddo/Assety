import React from 'react';

function DownloadButton({ url }) {
  // Example for downloading a PNG or GLB file
    const handleDownload = async () => {

    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    const filePath = await window.electronAPI.saveFile(url);
    if (!filePath) return;
    window.electronAPI.writeFile(filePath, arrayBuffer);
    console.log('File saved to:', filePath);
    };


  return <button onClick={handleDownload}>💾 Download</button>;
}


export default DownloadButton;
