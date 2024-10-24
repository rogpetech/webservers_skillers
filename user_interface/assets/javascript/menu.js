function openTab(event, tabName) {
  const tabContents = document.getElementsByClassName('tabcontent');
  const tabLinks = document.getElementsByClassName('tablink');

  for(let position = 0; position < tabContents.length; position++){
    tabContents[position].style.display = 'none';
  }


  for(let position = 0; position < tabLinks.length; position++){
    tabLinks[position].className = tabLinks[position].className.replace(' active-tab', "");
  }

  document.getElementById(tabName).style.display = 'block';
  event.currentTarget.className += ' active-tab';
}
