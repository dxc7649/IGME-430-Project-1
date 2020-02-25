const http = require('http');
const url = require('url');
const query = require('querystring');
const fs = require('fs');
const htmlHandler = require('./htmlResponses.js')

const paras = fs.readFileSync(`${__dirname}/paragraphs.json`);

const port = process.env.PORT || process.env.NODE_PORT || 3000;

let parasArray = JSON.parse(paras).paras;

// request handlers for 404 (error page)
const handlerNotFound = (request, response) => {
    const statusCode = 404;
    response.writeHead(statusCode, {
        'Content-type': 'text/html'
    });
    response.write("<html><body><h1>404 - Not Found</h1></body></html>");
    response.end();
};

// request handlers for 200 (display whole "jokesArray")
const handlerGetAllParas = (request, response) => {
    const statusCode = 200;
    response.writeHead(statusCode, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
    response.write(JSON.stringify(parasArray));
    response.end();
}

// request handlers for 200 (display random joke)
const handlerGetRandom = (request, response) => {
    const statusCode = 200;
    const arrayLength = parasArray.length;
    
    response.writeHead(statusCode, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*'});
    response.write(JSON.stringify(parasArray[parseInt(Math.random() * arrayLength)]));
    response.end();
};

// urlStruct
const urlStruct = {
    'GET': {
    //endpoints(in the end of url) for getting information from "jokesArray", not changing involve
        '/getAllParas': handlerGetAllParas,
        '/getRandomParas': handlerGetRandom,
        '/': htmlHandler.getIndex,
    },
    'POST': {},
    'HEAD': {},
    notFound: handlerNotFound
};

// onRequest
const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url);
    const pathname = parsedUrl.pathname;
    const httpMethod = request.method;
    const params = query.parse(parsedUrl.query);

    console.log(`pathname = ${pathname}`);
    console.log(`httpMethod = ${httpMethod}`);
    console.log(`params = ${Object.keys(params)}`);

    if (urlStruct[httpMethod][pathname]) {
        //look back to "urlStruct" to check if there is existed method
        urlStruct[httpMethod][pathname](request, response);
    } else {
        urlStruct.notFound(request, response);
    }
};

//let init = () => {
    //const paras = fs.readFileSync(`${__dirname}/paragraphs.json`);

    //parasArray = JSON.parse(paras).paras;
    //console.log(`There are ${parasArray.length} paragraphs!`

    http.createServer(onRequest).listen(port);
    console.log(`Listening on 127.0.0.1: ${port}`);
//}

//init();