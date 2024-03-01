async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    let url = tab.url;
    return `${url}`;
  }



  export default getCurrentTab;



