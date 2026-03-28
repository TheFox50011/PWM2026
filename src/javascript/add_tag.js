function add_tag(){
    let tagInput=document.querySelector(".tags-input");
    let tagText = tagInput.value;
    if (tagText === ""){ return; }
    let tag= document.createElement('div')
    tag.classList.add('tag');
    tag.innerHTML=tagText;
    document.querySelector('.tags-area').appendChild(tag);
    tagInput.value='';
}