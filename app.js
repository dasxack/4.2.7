const searchField = document.querySelector('.search-field')
const autocomBox = document.querySelector('.autocom-box')
const repoItems = document.querySelector('.repo-items')
const repo = document.querySelector('.repo-items__el')
searchField.addEventListener('keyup', (e) => {
  const searchText = e.target.value
  if (searchText && e.key != 'Backspace') {
    toDebounce(searchText)
  } else {
    autocomBox.textContent = ''
  }
})

async function getData(searchQuery) {
  return await fetch(
    `https://api.github.com/search/repositories?q=${searchQuery}&per_page=5`
  )
    .then((res) => res.json())
    .then((data) => {
      autocomBox.innerHTML = ''
      const fragment = document.createDocumentFragment()
      data.items.forEach((item) => {
        const newSearchEl = createSearchString(item)
        newSearchEl.addEventListener('click', () => {
          searchField.value = ''
          autocomBox.innerHTML = ''
          createRepo(item)
        })
        fragment.appendChild(newSearchEl)
      })
      autocomBox.appendChild(fragment)
    })
}

const debounce = (fn, delay) => {
  let timeout

  return function () {
    const fnCall = () => {
      fn.apply(this, arguments)
    }

    clearTimeout(timeout)
    timeout = setTimeout(fnCall, delay)
  }
}

let toDebounce = debounce(getData, 500)

function createSearchString(item) {
  const searchString = document.createElement('li')
  searchString.innerHTML = '<button></button>'
  const buttons = searchString.querySelector('button')
  console.log(buttons)
  buttons.innerText = item.name
  return searchString
}

function createRepo(repoData) {
  repoItems.innerHTML += `          <div class='repo-items__el'>
  <p>Name: ${repoData.name}</p>
                                            <p>Owner: ${repoData.owner.login}</p>
                                            <p>Stars: ${repoData.stargazers_count}</p>
                                            <img src = './img/cross.png' class='remove'>
                                            </div>`
}
repoItems.addEventListener('click', function (event) {
  if (event.target && event.target.tagName === 'IMG') {
    event.target.parentElement.remove()
  }
})
