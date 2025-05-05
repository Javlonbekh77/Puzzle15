const squares = document.querySelectorAll('.square'),
	mainContent = document.querySelector('.main-content'),
	moveCount = document.querySelector('.move-count'),
	timer = document.querySelector('.timer'),
	loading = document.querySelector('.loading')

const matrix = [[], [], [], []]

let array = []

function isSolvable(tiles) {
	let invCount = 0
	for (let i = 0; i < 15; i++) {
		for (let j = i + 1; j < 16; j++) {
			if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) {
				invCount++
			}
		}
	}

	const emptyRowFromBottom = 4 - Math.floor(tiles.indexOf(0) / 4)
	return (invCount % 2 === 0) === (emptyRowFromBottom % 2 === 1)
}

function generateSolvablePuzzle() {
	let puzzle
	do {
		puzzle = [...Array(16).keys()]
		for (let i = puzzle.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[puzzle[i], puzzle[j]] = [puzzle[j], puzzle[i]]
		}
	} while (!isSolvable(puzzle))
	return puzzle
}

function showMatrix() {
	array = generateSolvablePuzzle()

	squares.forEach((item, j) => {
		item.classList.remove('not')
	})

	squares.forEach((item, j) => {
		if (array[j] == 0) {
			item.classList.add('not')
			item.textContent = ''
		} else {
			item.textContent = array[j]
		}
	})
}

showMatrix()

function showLoader() {
	loading.style.display = 'flex'
	document.querySelector('.container-1').style.display = 'none'
}

function hideLoader() {
	loading.style.display = 'none'
	document.querySelector('.container-1').style.display = 'flex'
}
setTimeout(hideLoader, 1700)
showLoader()
let seconds = 0
function Timer() {
	const display = document.getElementById('timer')

	timerInterval = setInterval(() => {
		seconds++
		let minutes = Math.floor(seconds / 60)
		let remainingSeconds = seconds % 60

		// Add leading zeros
		const formattedMinutes = minutes < 10 ? '0' + minutes : minutes
		const formattedSeconds =
			remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds

		display.textContent = `${formattedMinutes}:${formattedSeconds}`
	}, 1000)
}

console.log(seconds)
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		// Elementlarni joyini almashtiramiz
		;[array[i], array[j]] = [array[j], array[i]]
	}
	return array
}

for (let i = 0; i < 16; i++) {
	if (i / 4 < 1) {
		matrix[0].push(squares[i])
	} else if (i / 4 < 2) {
		matrix[1].push(squares[i])
	} else if (i / 4 < 3) {
		matrix[2].push(squares[i])
	} else {
		matrix[3].push(squares[i])
	}
}

// console.log(matrix);

function Replace(x1, y1, x2, y2) {
	matrix[x1][y1].classList.add('not')
	matrix[x2][y2].textContent = matrix[x1][y1].textContent
	matrix[x2][y2].classList.remove('not')
	matrix[x1][y1].textContent = ''
	setTimeout(() => {
		isWin()
	}, 300)
}

let move = 0

function MoveCounters() {
	moveCount.textContent = move
}

MoveCounters()

const inputBtn = document.querySelector('input')
inputBtn.addEventListener('click', () => {
	inputBtn.style.cssText = 'box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.2);'
	window.scrollBy(0, 500)
})

const startBtn = document.querySelector('.start-btn')
startBtn.addEventListener('click', () => {
	if (document.querySelector('input').value) {
		document.querySelector('.container-1').style.display = 'none'
		showLoader()
		setTimeout(() => {
			hideLoader()
			document.querySelector('.container-1').style.display = 'none'
			document.querySelector('.container').style.display = 'flex'
		}, 1800)
		Timer()
	} else {
		alert('Ismingizni kiriting!!')
	}
})

matrix.forEach((row, index) => {
	row.forEach((item, idx) => {
		item.addEventListener('click', () => {
			if (
				matrix[index][idx - 1] &&
				matrix[index][idx - 1].classList.contains('not')
			) {
				Replace(index, idx, index, idx - 1)
				move++
			} else if (
				matrix[index][idx + 1] &&
				matrix[index][idx + 1].classList.contains('not')
			) {
				Replace(index, idx, index, idx + 1)
				move++
			} else if (
				matrix.length > index + 1 &&
				matrix[index + 1][idx].classList.contains('not')
			) {
				Replace(index, idx, index + 1, idx)
				move++
			} else if (
				index - 1 > -1 &&
				matrix[index - 1][idx].classList.contains('not')
			) {
				Replace(index, idx, index - 1, idx)
				move++
			}
			MoveCounters()

			console.log(move)
		})
	})
})

function isWin() {
	let massiv = []
	matrix.forEach(items => {
		items.forEach(item => {
			if (item.textContent == '') {
				massiv.push('16')
			} else {
				massiv.push(item.textContent)
			}
		})
	})
	let res = true
	console.log(massiv)
	massiv.forEach((item, idx) => {
		if (idx + 1 != item) res = false
	})

	if (res) {
		Options = false
		// alert(`${document.querySelector('input').value} You Winn!!!`)
		submitScore(document.querySelector('input').value, seconds)
		loadLeaderboard()
		clearInterval(timerInterval)
		document.querySelector('.container').style.display = 'none'
		document.querySelector('.congr').style.display = 'flex'
		// window.scrollBy(0, window.innerHeight)
		console.log(seconds)

		window.scrollTo({
			top: window.innerHeight,
			behavior: 'smooth',
		})
	}
}

// setTimeout(() => {
// 	isWin()
// }, 1000)

function submitScore(name, score) {
	fetch('https://sheetdb.io/api/v1/im50j206xv243', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			data: [{ name: name, score: score }],
		}),
	})
		.then(res => res.json())
		.then(data => {
			console.log('Score added!', data)
		})
}
function loadLeaderboard() {
	fetch('https://sheetdb.io/api/v1/im50j206xv243')
		.then(res => res.json())
		.then(data => {
			// Unikal name + score kombinatsiyalarini ajratib olish
			const seen = new Set()
			const unique = data.filter(entry => {
				const key = `${entry.name}-${entry.score}`
				if (seen.has(key)) {
					return false
				}
				seen.add(key)
				return true
			})

			// Saralash
			let sorted = unique.sort((a, b) => a.score - b.score)

			// HTMLga aylantirish
			let html = sorted
				.map(entry => `<li>${entry.name}: ${entry.score} seconds</li>`)
				.join('')

			document.querySelector('.ranks').innerHTML = `<ol>${html}</ol>`
		})
}

loadLeaderboard()

function hideRanks() {
	document.querySelector('.leaderboard-section').style.display = 'none'
	document.querySelector('.container').style.display = 'flex'
}

function showRanks() {
	document.querySelector('.leaderboard-section').style.display = 'flex'
	document.querySelector('.container').style.display = 'none'
}

let Options = true

const exitBtn = document.querySelector('.exit-btn')
exitBtn.addEventListener('click', () => {
	if (Options) hideRanks()
	else document.querySelector('.congr').style.display = 'flex'
	document.querySelector('.leaderboard-section').style.display = 'none'
})

const rankLogo = document.querySelector('.rank-logo')
document.querySelector('.rank-logo').addEventListener('click', () => {
	loadLeaderboard()
	showRanks()
})

document
	.querySelector('.leaderboard-section')
	.addEventListener('click', event => {
		if (event.target.classList.contains('leaderboard-section')) {
			if (Options) hideRanks()
			else document.querySelector('.congr').style.display = 'flex'
		}
		// document.querySelector('.leaderboard-section').style.display = 'none'
	})

const ranks = document.querySelector('.ranks')

let scrollTimeout

ranks.addEventListener('scroll', () => {
	// Thumbni ko'rsatish
	ranks.style.setProperty('--scroll-visible', 'true')

	// Scrollbarni ko'rsatish (CSS stilini o'zgartiramiz)
	const style = document.createElement('style')
	style.innerHTML = `
    .ranks::-webkit-scrollbar-thumb {
      background-color: #888;
    }
  `
	document.head.appendChild(style)

	// Agar scroll tugasa 1.5 soniyadan keyin yana yashiramiz
	clearTimeout(scrollTimeout)
	scrollTimeout = setTimeout(() => {
		style.remove()
	}, 1500)
})

document.querySelector('.restart').addEventListener('click', () => {
	console.log('Hello')
	Options = true
	clearInterval(timerInterval)
	seconds = 0
	move = 0
	MoveCounters()
	document.querySelector('.container-1').style.display = 'none'
	showLoader()
	setTimeout(() => {
		hideLoader()
		document.querySelector('.container-1').style.display = 'none'
		document.querySelector('.container').style.display = 'flex'
	}, 1800)
	Timer()
	document.querySelector('.congr').style.display = 'none'
	showMatrix()
})

document.querySelector('.liderboarding').addEventListener('click', () => {
	document.querySelector('.congr').style.display = 'none'
	loadLeaderboard()
	document.querySelector('.leaderboard-section').style.display = 'flex'
})

window.addEventListener('click', e => {
	console.log(e.target)
})

document.querySelector('.restart-1').addEventListener('click', () => {
	console.log('Hello')
	Options = true
	seconds = 0
	move = 0
	MoveCounters()
	showMatrix()
})
