import axios from 'axios';

export const ipProd = 'https://api.supportpalumbi.site/license/'

const ipDev = "";

const mode = "prod";

export const getIp = () => {
  if (mode === "prod") return ipProd;
  else return ipDev;
};

export const getRequest = (url, token) => {
  console.log(getIp() + url);

  return fetch(getIp() + url, {
    method: "GET",
    headers: {
      Authorization: token ? "Bearer " + token : undefined,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postRequest = (url, body, token) => {
  console.log(getIp() + url);
  console.log(JSON.stringify(body));
  return fetch(
    getIp() + url,

    {
      method: "POST",
      headers: {
        Authorization: token ? "Bearer " + token : undefined,
        Accept: "application/json",
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(body),
      //body: JSON.stringify({email: "em@intelli-next.com",password: "12345"})
    }
  )
    .then((res) => {

      return res.json();
    })
    .catch((err) => {
      console.log(err);
    });

  /*  return axios.post(getIp() + url, JSON.stringify(body),
      {
  
        headers: {
          Authorization: token ? "Bearer " + token : undefined,
          Accept: "application/json",
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
  
        },
  
        //body: JSON.stringify({email: "em@intelli-next.com",password: "12345"})
      }
    )
      .then(res => {
        console.log(res);
        console.log(res.data);
        return res.json();
      }).catch((err) => {
        console.log(err);
      });*/
};

export const postFormDataRequest = (url, body, token) => {
  return fetch(getIp() + url, {
    method: "POST",
    headers: {
      Authorization: token ? token : undefined,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      console.log(res.json());
      return res.json();
    })
    .catch((err) => {
      return err;
    });
};
