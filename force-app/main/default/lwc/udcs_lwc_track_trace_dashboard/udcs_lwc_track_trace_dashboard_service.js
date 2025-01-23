async function service(method, request, callback) {
  console.log("InServiceFunction");
  //async ()=>{

  await method(request).then((result) => {
    console.log("Service function");
    console.log(result);
    callback(result);
  });
  //}
}
export default { service };