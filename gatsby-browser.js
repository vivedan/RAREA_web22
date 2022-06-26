const React = require("react")
const Layout = require("./src/components/Layout").default



exports.wrapPageElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return <Layout {...props}>{element}</Layout>
}

// in gatsby-browser.js
/* export function shouldUpdateScroll(prevRouterProps, { location }) {
  window.scrollTo(0, 0)
  const body = document.getElementsByTagName('body')[0]
  body.scrollTop = 0
  return false
} */


//WHEN NAVIGATING SCROLL TO TOP
exports.shouldUpdateScroll = ({
  routerProps: { location },
  getSavedScrollPosition,
}) => {
  //const { pathname } = location
  // if the new route is part of the list above, scroll to top (0, 0)
  
  window.scrollTo(0, 0);
  const body = document.getElementsByClassName('mainCont')[0];
  if(body){
    body.scrollTop = 0;
  }
  

  return false
}