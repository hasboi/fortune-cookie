const $ = (selector) => document.getElementById(selector);

const curveText1 = new CircleType($("curved1"));
const curveText2 = new CircleType($("curved2"));
curveText1.radius(600);
curveText2.radius(500);

const paperTurn = new Audio(
	"audio/46631__123jorre456__sliding-paper-on-table2.wav"
);

const paperSlide = new Audio(
	"audio/46631__123jorre456__sliding-paper-on-table.wav"
);

const crack = new Audio("audio/524608__clearwavsound__cracking-knuckles.wav");

const fortunes = [
	"you will learn about e. coli the hard way",
	"enjoy ice cream while you can",
	"the person behind you is reading this too",
	"the fortune cookie is lying. or is it?",
	"you will accidentally call your teacher 'mom'",
	"someone is currently spelling/pronouncing your name wrong with confidence",
	"be careful where you leave your socks",
	"the first picture you see after opening pinterest",
	"someone is thinking about you. unfortunately",
	"a stranger will sneeze exactly three times near you this week, cover your nose",
	"you will find exactly 0.23 dollars on the ground. do not take it, just nod your head and walk away",
	"you'll drop your phone today, and it will land perfectly on its edge",
	"wash your hands",
	"a crow will notice you. do not engage",
	"your wifi demands a reboot",
	"the algorithm is flirting with you",
];

const rareMessage =
	"this message has a probability of 1%, you don't need fortune cookie anymore";

const forAnim = [$("message-container"), $("message"), $("message-wrapper")];

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getUsedFortunes() {
	return JSON.parse(localStorage.getItem("usedFortunes")) || [];
}

function saveUsedFortune(fortune) {
	const used = getUsedFortunes();
	used.push(fortune);
	localStorage.setItem("usedFortunes", JSON.stringify(used));
}

function resetFortunes() {
	localStorage.removeItem("usedFortunes");
}

function getFortune() {
	const chance = Math.random();
	if (chance <= 0.01) {
		return rareMessage;
	}

	let used = getUsedFortunes();

	if (used.length >= fortunes.length) {
		resetFortunes();
		used = [];
	}

	const available = fortunes.filter((f) => !used.includes(f));

	const fortune = available[getRandom(0, available.length - 1)];

	saveUsedFortune(fortune);

	return fortune;
}

let maxClick = getRandom(2, 4);
let clicked = 0;

const cookieAnimation = [
	{ transform: "rotate(-10deg) translateY(0)" },
	{ transform: "rotate(10deg) translateY(0)" },
	{
		transform:
			"rotate(0) translateY(0);	transition: transform 0.5s ease, opacity 1s ease;",
	},
];

const cookieTiming = { duration: 100 };

$("cookie").addEventListener("click", () => {
	crack.currentTime = 0;
	crack.play();
	$("message").scrollTo({
		left: 0,
		behavior: "smooth",
	});

	const anim = $("cookie").animate(cookieAnimation, cookieTiming);
	clicked += 1;

	if (clicked >= maxClick) {
		paperSlide.currentTime = 0;
		paperTurn.currentTime = 0;
		paperSlide.play();
		for (let element of forAnim) {
			element.classList.add("shown");
		}

		anim.cancel();
		requestAnimationFrame(() => {
			$("cookie").classList.add("hidden");
		});

		$("message").innerText = getFortune();

		clicked = 0;
		maxClick = getRandom(2, 4);
		paperTurn.play();
	}
});

$("close").addEventListener("click", () => {
	for (let element of forAnim) {
		element.classList.remove("shown");
	}
	$("cookie").classList.remove("hidden");
});

let leftWidth = 0;
let rightWidth = 0;

function updateRolls() {
	const clientW = $("message").clientWidth;
	const scrollLeft = $("message").scrollLeft;
	const scrollW = $("message").scrollWidth;

	const totalOverflow = Math.max(0, scrollW - clientW);
	const scrolled = scrollLeft;
	const remaining = Math.max(0, scrollW - (scrollLeft + clientW));

	let targetRight = 0;
	let targetLeft = 0;

	if (totalOverflow > 1) {
		const maxRollWidth = 10;

		const ratioRight = remaining / totalOverflow;
		const ratioLeft = scrolled / totalOverflow;

		targetRight = Math.round(ratioRight * maxRollWidth);
		targetLeft = Math.round(ratioLeft * maxRollWidth);
	}

	rightWidth += (targetRight - rightWidth) * 0.2;
	leftWidth += (targetLeft - leftWidth) * 0.2;

	if (targetRight === 0 && rightWidth < 0.2) {
		$("roll-right").style.width = "0px";
		$("roll-right").style.opacity = "0";
		rightWidth = 0;
	} else {
		$("roll-right").style.width = rightWidth + "px";
		$("roll-right").style.opacity = "1";
	}

	if (targetLeft === 0 && leftWidth < 0.2) {
		$("roll-left").style.width = "0px";
		$("roll-left").style.opacity = "0";
		leftWidth = 0;
	} else {
		$("roll-left").style.width = leftWidth + "px";
		$("roll-left").style.opacity = "1";
	}

	requestAnimationFrame(updateRolls);
}

requestAnimationFrame(updateRolls);
