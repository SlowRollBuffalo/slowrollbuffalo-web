<html>
<head>

	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.3/css/foundation.min.css" />

	<style>

	body {
		width: 100%;
		margin: 0;
		padding: 0;
	}

	/*.page-wrapper {
		width: 800px;
		margin: auto;
	}*/

	table {
		width: 100%;
	}

	</style>

</head>
<body>

	<div class="page-wrapper">
		<div class="row">
			<div class="columns large-12">
				<h2>${ride.title}</h2>
				<p>Report Generated: ${now}</p>
				<h5>Ride Checkins:</h5>
				<table>
					<thead>
						<tr>
							<th>Last</th>
							<th>First</th>
							<th>Email</th>
							<th>Checkin Time</th>
						</tr>
					</thead>
					<tbody>
					%for checkin, user in checkins:
						<tr>
							<td>${user.last}</td>
							<td>${user.first}</td>
							<td>${user.email}</td>
							<td>${checkin.creation_datetime.split('.'[0])}</td>
						</tr>
					%endfor
					</tbody>
				</table>
			</div>
		</div>
	</div>

</body>
</html>