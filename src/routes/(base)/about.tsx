import LinkedInIcon from "~/assets/icons/linkedin.svg";
import Logo from "~/assets/logo.svg";
import TargetIcon from "lucide-solid/icons/target";
import EyeIcon from "lucide-solid/icons/eye";
import HeartIcon from "lucide-solid/icons/heart";
import "./about.css";

export default function AboutPage() {
	return (
		<main>
			<div class="about-hero">
				<div class="container">
					<h1>Give your items a second chance</h1>
					<p>We believe in rebirth, renewal, and community.</p>
				</div>
			</div>

			<div class="container">
				<div class="mission-grid">
					<div class="mission-card">
						<div class="mission-icon">
							<TargetIcon size="48" class="mx-auto" />
						</div>
						<h3>Our Mission</h3>
						<p>
							Reduce waste and give used items a new life — donate
							or trade smartly.
						</p>
					</div>
					<div class="mission-card">
						<div class="mission-icon">
							<EyeIcon size="48" class="mx-auto" />
						</div>
						<h3>Our Vision</h3>
						<p>
							Egypt’s leading circular economy platform for
							solidarity and exchange.
						</p>
					</div>
					<div class="mission-card">
						<div class="mission-icon">
							<HeartIcon size="48" class="mx-auto" />
						</div>
						<h3>Our Values</h3>
						<p>
							Trust, sustainability, community impact, innovation.
						</p>
					</div>
				</div>

				<div class="story-section">
					<div class="story-text">
						<h2 class="text-2xl font-bold">The Phoenix Story</h2>
						<p>
							The Phoenix is a legendary bird that symbolizes
							rebirth, transformation, and hope. It rises from its
							own ashes, starting a new life stronger than before.
						</p>
						<p>
							We chose Phoenix because it reflects our core idea:
							items that seem old are given a second life through
							our marketplace. Instead of being wasted, they are
							reborn into something valuable for someone else.
						</p>
						<p>
							Our donation system turns unused belongings into
							acts of kindness, creating positive impact in the
							community.
						</p>
						<p>
							<strong>
								Phoenix is a cycle of renewal — giving and
								reusing bring new beginnings.
							</strong>
						</p>
					</div>
					<div class="story-logo-box">
						<div class="magic-logo">
							<Logo />
						</div>
					</div>
				</div>

				<div class="howitworks">
					<h2 class="text-2xl text-center font-bold">How It Works</h2>
					<div class="flow-steps">
						<div class="flow-step">
							<div class="step-number">1</div>
							<i
								class="fas fa-upload"
								style="font-size:2rem; color:var(--accent-1);"
							></i>
							<h3>Listing & Classification</h3>
							<p>
								User uploads an item, chooses category: Donate
								or Exchange/Sell.
							</p>
						</div>
						<div class="flow-step">
							<div class="step-number">2</div>
							<i
								class="fas fa-robot"
								style="font-size:2rem; color:var(--accent-1);"
							></i>
							<h3>AI Matching & Communication</h3>
							<p>
								AI matches items or allows browsing. Chat
								directly on the platform.
							</p>
						</div>
						<div class="flow-step">
							<div class="step-number">3</div>
							<i
								class="fas fa-handshake"
								style="font-size:2rem; color:var(--accent-1);"
							></i>
							<h3>Successful Rebirth</h3>
							<p>
								Meet safely, complete the exchange — give the
								item a second life.
							</p>
						</div>
					</div>
				</div>

				<div class="gallery">
					<h2 class="text-2xl text-center font-bold">
						Moments of Giving & Exchange
					</h2>
					<div class="gallery-grid">
						<div class="gallery-item">
							<img
								src="assets/images/Donations01.jpg"
								alt="Donation"
							/>
						</div>
						<div class="gallery-item">
							<img
								src="assets/images/Donations02.jpg"
								alt="Donation"
							/>
						</div>
						<div class="gallery-item">
							<img
								src="assets/images/Donations03.jpg"
								alt="Donation"
							/>
						</div>
						<div class="gallery-item">
							<img
								src="assets/images/Donations04.jpg"
								alt="Donation"
							/>
						</div>
						<div class="gallery-item">
							<img
								src="assets/images/Donations05.jpg"
								alt="Donation"
							/>
						</div>
					</div>
				</div>

				<div class="team-section">
					<h2 class="text-2xl text-center font-bold">Meet the Phoenix Team</h2>
					<div class="team-grid">
						<div class="team-card">
							<div class="team-avatar">L</div>
							<h4>Lamiaa Elsheikh</h4>
							<p>UI/UX & Frontend</p>
							<div class="team-social">
								<a
									href="https://www.linkedin.com/in/lamiaa-elsheikh-272b3831a"
									target="_blank"
								>
									<LinkedInIcon />
								</a>
							</div>
						</div>
						<div class="team-card">
							<div class="team-avatar">A</div>
							<h4>Abdallah Samir</h4>
							<p>UI/UX & Frontend</p>
							<div class="team-social">
								<a
									href="https://www.linkedin.com/in/abdallah-samir-022b8a271"
									target="_blank"
								>
									<LinkedInIcon />
								</a>
							</div>
						</div>
						<div class="team-card">
							<div class="team-avatar">H</div>
							<h4>Hana El-Zeiny</h4>
							<p>AI & ML Engineer</p>
							<div class="team-social">
								<a
									href="https://www.linkedin.com/in/hana-el-zeiny-6974ab311"
									target="_blank"
								>
									<LinkedInIcon />
								</a>
							</div>
						</div>
						<div class="team-card">
							<div class="team-avatar">N</div>
							<h4>Nada El Kolaly</h4>
							<p>Backend Developer</p>
							<div class="team-social">
								<a
									href="https://www.linkedin.com/in/nada-elkolaly-3075b424b"
									target="_blank"
								>
									<LinkedInIcon />
								</a>
							</div>
						</div>
						<div class="team-card">
							<div class="team-avatar">M</div>
							<h4>Mohamed Bahaa</h4>
							<p>Backend Developer</p>
							<div class="team-social">
								<a
									href="https://www.linkedin.com/in/mohamed-bahaa-9684b726a"
									target="_blank"
								>
									<LinkedInIcon />
								</a>
							</div>
						</div>
						<div class="team-card">
							<div class="team-avatar">O</div>
							<h4>Osama Muhammad Kamal</h4>
							<p>Backend Developer</p>
							<div class="team-social">
								<a
									href="https://www.linkedin.com/in/osamamragab"
									target="_blank"
								>
									<LinkedInIcon />
								</a>
							</div>
						</div>
						<div class="team-card">
							<div class="team-avatar">M</div>
							<h4>Marena Emad</h4>
							<p>Flutter Developer</p>
							<div class="team-social">
								<a
									href="https://www.linkedin.com/in/marena-emad-b9a542272"
									target="_blank"
								>
									<LinkedInIcon />
								</a>
							</div>
						</div>
						<div class="team-card">
							<div class="team-avatar">A</div>
							<h4>Ahmed El-Hamaky</h4>
							<p>Flutter Developer</p>
							<div class="team-social">
								<a
									href="https://www.linkedin.com/in/ahmed-elhamaky-49440b312"
									target="_blank"
								>
									<LinkedInIcon />
								</a>
							</div>
						</div>
						<div class="team-card">
							<div class="team-avatar">Z</div>
							<h4>Zyad Mohamed</h4>
							<p>QA & Deployment</p>
							<div class="team-social">
								<a
									href="https://www.linkedin.com/in/zyadmohamed"
									target="_blank"
								>
									<LinkedInIcon />
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
