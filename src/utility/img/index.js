import React from 'react'

export const toBase64 = (file,evt) =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = () => {
    //resolve(reader.result)
    var _src = reader.result.toString();
    
    evt(_src)
  };
  reader.onerror = (error) => reject(error);
});