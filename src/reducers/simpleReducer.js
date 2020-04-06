export default (state = {}, action) => {
console.log("Running simple reducer");
console.log(state);
console.log(action);
 switch (action.type) {
  case 'SIMPLE_ACTION':
   let ns = { ...state, result: action.payload, user:"Fake_username"};
   console.log("NEW STATE");
   console.log(ns);
   return ns;
  default:
   return state
 }
}
