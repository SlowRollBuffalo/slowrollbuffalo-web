<!DOCTYPE HTML>
<!--
    Alpha by Pixelarity
    pixelarity.com @pixelarity
    License: pixelarity.com/license
-->
<html>
    <head>
        <title>Slow Roll Buffalo</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="static/css/main.css" />
        <link rel="stylesheet" href="static/css/site.css" />
    </head>
    <body class="landing">
        <div id="page-wrapper">

            <!-- Header -->
                <header id="header" class="alt">
                    <h1>Slow Roll Buffalo</h1>
                </header>

            <!-- Banner -->
                <section id="banner" class="frontpage-banner">
                    <h2>Slow Roll Buffalo</h2>
                    <p>Bicycle with neighbors through the city of good neighbors.</p>
                    <ul class="actions">
                        <!--<li><a href="#" class="button special">Sign Up</a></li>-->
                        <!--<li><a href="#" class="button">Learn More</a></li>-->
                        <img id="google-icon" src="static/images/google-play-badge.png"></img>
                        </br>
                        <img id="ios-icon" src="static/images/Get_it_on_iTunes_Badge_US_1114.svg"></img>
                    </ul>
                </section>

            <!-- Main -->
                <section id="main" class="container">

                    <section class="box special">
                        <header class="major">
                            <h2>What is SlowRoll Buffalo?</h2>
                            <p>Founded in Detroit, Slow Roll Buffalo is a group bicycle ride that meets every Monday night and has expanded into a Global network of community rides. Each week we meet at different venues and take a unique route throughout the city, including all the major and minor neighborhoods that we are so proud of. Slow Roll is for everyone; all ages, all skill levels and every type of bike is welcome. Bicycle through Buffalo with 500 of your new best friends! Our slow pace keeps the group safe and gives riders a unique perspective of our great city and its neighborhoods. Minors under 18 must be accompanied by a parent/guardian.</p>
                        </header>
                    </section>

                    <section class="box special">
                        <iframe width="100%" height="444" src="https://www.youtube.com/embed/LABofY1Ysh0" frameborder="0" allowfullscreen></iframe>
                    </section>

                    <section class="box special features">
                        <div class="row">
                            <!--<div class="6u 12u(narrower)">-->
                            <div>
                                <h2>Get involved!</h2>
                                <p>Schedule, locations, and volunteer opportunities with Slow Roll Buffalo can be found by joining our open <a href="http://www.facebook.com/groups/slowrollbuffalo/">Facebook group</a>. Slow Roll is free, but does require advance registration, which can be done online <a href="http://www.slowrollbuffalo.org/registration">HERE</a>. Information on the worldwide Slow Roll movement can be found at <a href="http://slowroll.bike">www.slowroll.bike</a>. We hope to have you rolling with us soon!</p>
                            </div>
                            <!--
                            <div class="6u 12u(narrower)">
                                <h3>SlowRoll Buffalo code of conduct</h3>
                                <ol>
                                    <li>#SQUAD is king</li>
                                    <li>Come prepared</li>
                                    <li>Stay right</li>
                                    <li>Communicate</li>
                                    <li>Stay alert &amp; be awaye</li>
                                    <li>Share the road</li>
                                    <li>Stick together</li>
                                    <li>Roll slow</li>
                                    <li>Don't show off</li>
                                    <li>Never litter</li>
                                    <li>Encourage positivity</li>
                                    <li>Play music respectively</li>
                                    <li>Make friends &amp; have fun</li>
                                </ol>
                            </div>
                            -->
                        </div>
                    </section>

                    <section class="box special features">
                        <div class="row">
                            <h2>Every Monday - Meet at 6:00, Ride at 6:30</h2>
							<div class="table-wrapper" style="width: 100%;">
								<table>
									<thead>
										<tr>
											<td>Date</td>
											<td>Sponsor</td>
											<td>Location</td>
											
										</tr>
									</thead>
									<tbody>
									% for r in rides:
										<tr>
											<td>${r['ride']['ride_datetime']}</td>
											<td>${r['partner']['name'] if r['partner'] != None else ''}</td>
											<td>${r['ride']['address_0']}<br/>${r['ride']['city']}, ${r['ride']['zipcode']}</td>
										</tr>
									% endfor
									</tbody>
								</table>
							</div>
                        </div>
                    </section>

	                <section class="box special">
						<iframe width="100%" height="444" src="https://www.youtube.com/embed/JklTTYZcVWg" frameborder="0" allowfullscreen></iframe>
	                </section>
                </section>

            <!-- CTA -->
            <!--
                <section id="cta">

                    <h2>Want more updates?</h2>
                    <p>Sign up and receive venue and ride schedule updates, related rides, as well as news from the global movement that Slow Roll has become.</p>

                    <form>
                        <div class="row uniform 50%">
                            <div class="6u 12u(mobilep)">
                                <input type="text" name="name" id="name" placeholder="Name" />
                            </div>
                            <div class="6u 12u(mobilep)">
                                <input type="email" name="email" id="email" placeholder="Email Address" />
                            </div>
                        </div>
                        <div class="row uniform 50%">
                            <div class="12u 12u(mobilep)">
                                <input style="width: 150px; margin: auto;" type="submit" value="Sign Up" class="fit" />
                            </div>
                        </div>
                    </form>
				</section>
			-->

            <!-- Footer -->
                <footer id="footer">
                    <ul class="icons">
                        <li><a href="https://www.facebook.com/events/286573141524950/" class="icon fa-twitter"><span class="label">Twitter</span></a></li>
                        <li><a href="https://twitter.com/search?q=slowrollbuffalo" class="icon fa-facebook"><span class="label">Facebook</span></a></li>
                        <!--<li><a href="#" class="icon fa-instagram"><span class="label">Instagram</span></a></li>-->
                        <li><a href="https://github.com/slowrollbuffalo" class="icon fa-github"><span class="label">Github</span></a></li>
                        <!--<li><a href="#" class="icon fa-dribbble"><span class="label">Dribbble</span></a></li>-->
                        <!--<li><a href="#" class="icon fa-google-plus"><span class="label">Google+</span></a></li>-->
                    </ul>
                    <ul class="copyright">
                        <li>&copy; SlowRoll Buffalo Buffalo. All rights reserved.</li>
                    </ul>
                </footer>

        </div>

        <!-- Scripts -->
            <script src="static/js/jquery.min.js"></script>
            <!--<script src="static/js/jquery.dropotron.min.js"></script>-->
            <script src="static/js/jquery.scrollgress.min.js"></script>
            <script src="static/js/skel.min.js"></script>
            <script src="static/js/util.js"></script>
            <script src="static/js/main.js"></script>

    </body>
</html>
