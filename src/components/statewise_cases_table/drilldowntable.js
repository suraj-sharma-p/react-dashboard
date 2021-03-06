import React from 'react';
import classes from './drilldowntable.module.css';


const drilldowntable = (props) => {
	let district_classes = 'districtVisible';

	
	const getTableRowByProp = (item,propcases) =>{
		let htmlString = "";
		if(parseInt(item.delta[propcases])>0)
		{
			htmlString = "<td><span class=delta"+propcases+"> <i class='fa fa-arrow-up' aria-hidden='true'></i>"+
			item.delta[propcases]+"</span><span>"+item[propcases]+"</span></td>";
		}
		else{
			htmlString = "<td>"+item[propcases]+"</td>"
		}	

		return htmlString

	}

	const rowClickHandler = (event) => {
		if (event.currentTarget.dataset.isshow === 'false') {
			event.currentTarget.querySelectorAll('span.arrow')[0].className = 'arrow-rotate';

			let stateCode = event.currentTarget.dataset.statecode;
			let zone_data = props.zone_data.zones.filter((item) => item.statecode === stateCode);
			let districtsObj = props.district_data.find((element) => element.statecode === stateCode).districtData;
			let districtArray = sortArraybyProperty(convertObjToArray(districtsObj, zone_data), 'confirmed', false);

			let lastUpdatedTime = props.statewise_cases.find(item=>item.statecode===stateCode).lastupdatedtime;

			let lastUpdatedMsg = getLastUpdateTime(lastUpdatedTime);

			let currentTarget = event.currentTarget;
			let htmlString =
				'<tr class="district-space" data-district=districtVisible> <td colspan="5">' +
				'<span data-district=districtVisible class="district-space-container">' +
				'<span data-district=districtVisible class="legends" ><span class="zone zone-red"></span>' +
				'<span class="zone-text">Red Zone</span>' +
				'<span class="zone zone-orange"></span><span class="zone-text">Orange Zone</span>' +
				'<span class="zone zone-green"></span><span class="zone-text">Green Zone</span>' +
				`</span><span class="lastUpdated"><p>${lastUpdatedMsg}</p></span></span></td></tr>`;
			htmlString +=
				'<tr class=' +
				district_classes +
				' data-district=districtVisible ><th>District</th><th>Confirmed</th><th>Active</th><th>Recovered</th><th>Deceased</th></tr>';
			districtArray.forEach((item) => {
				if (item.district === 'Other State') return;
				htmlString +=
					'<tr data-district=districtVisible class=' +
					item.zone +
					' ><td class="district">' +
					item.district +
					'</td>' +
					getTableRowByProp(item,"confirmed")
					+
					'<td>' +
					item.active +
					'</td>' +
					getTableRowByProp(item,"recovered")+
					getTableRowByProp(item,"deceased")+
					'</td></tr>';
			});

			currentTarget.insertAdjacentHTML('afterend', htmlString);
			event.currentTarget.dataset.isshow = true;
		} else {
			document.querySelectorAll('[data-district=districtVisible]').forEach((item) => {
				item.outerHTML = '';
			});
			event.currentTarget.dataset.isshow = 'false';
			event.currentTarget.querySelectorAll('span.arrow-rotate')[0].className = 'arrow';
		}
	};

	const getLastUpdateTime = (lastUpdateTime) =>{
		let date_time = lastUpdateTime.split(" ");
		let date_arr= date_time[0].split("/");
		let time_arr = date_time[1].split(":");

		let lastUpdatedDate = new Date(parseInt(date_arr[2]),parseInt(date_arr[1])-1,parseInt(date_arr[0]),parseInt(time_arr[0]),parseInt(time_arr[1]));

		let currentDateTime = new Date();

		let lastUpdatedMsg="";
		if(currentDateTime.getMonth()-lastUpdatedDate.getMonth()>0)
		{
			let timeDiff = currentDateTime.getMonth() - lastUpdatedDate.getMonth();
			let timeUnit = timeDiff===1 ?"month" :"months";
			lastUpdatedMsg= `${currentDateTime.getMonth()-lastUpdatedDate.getMonth()} ${timeUnit} ago`;
			return lastUpdatedMsg;
		}
		if(currentDateTime.getDate() - lastUpdatedDate.getDate()>0)
		{
			let timeDiff = currentDateTime.getDate() - lastUpdatedDate.getDate();
			let timeUnit = timeDiff===1 ?"day" :"days";
			lastUpdatedMsg = `${currentDateTime.getDate() - lastUpdatedDate.getDate()} ${timeUnit} ago`;
			return lastUpdatedMsg;
		}
		if(currentDateTime.getHours() - lastUpdatedDate.getHours()>0)
		{
			let timeDiff = currentDateTime.getHours() - lastUpdatedDate.getHours();
			let timeUnit = timeDiff===1 ?"hour" :"hours";
			lastUpdatedMsg = `${currentDateTime.getHours() - lastUpdatedDate.getHours()} ${timeUnit} ago`;
			return lastUpdatedMsg;
		}
		if(currentDateTime.getMinutes() - lastUpdatedDate.getMinutes()>0)
		{
			let timeDiff = currentDateTime.getMinutes() - lastUpdatedDate.getMinutes();
			let timeUnit = timeDiff===1 ?"min" :"min";
			lastUpdatedMsg = `${currentDateTime.getMinutes() - lastUpdatedDate.getMinutes()} ${timeUnit} ago`;
			return lastUpdatedMsg;
		}
		return lastUpdatedMsg;
	}

	const convertObjToArray = (obj, zone_data) => {
		let objKeys = Object.keys(obj);
		let districtArray = [];

		objKeys.forEach((ele) => {
			obj[ele].district = ele;
			obj[ele].zone = zone_data.find((item) => item.district.toLowerCase() === ele.toLowerCase())
				? zone_data.find((item) => item.district === ele).zone
				: '';
			districtArray.push(obj[ele]);
		});

		return districtArray;
	};

	const sortArraybyProperty = (array, prop, isasc) => {
		if (isasc) return array.sort((a, b) => (a[prop] > b[prop] ? 1 : -1));
		else return array.sort((a, b) => (a[prop] < b[prop] ? 1 : -1));
	};
    
	const tableDataGenerate = (item, className,propName) => {
		if (parseInt(item[className]) > 0) {
			return (
				<td>
					<span className={classes[className]}><i className="fa fa-arrow-up" aria-hidden="true"></i>{item[className]} </span>
					<span >{item[propName]}</span>
				</td>
			);
		} else {
			return <td>{item[propName]}</td>;
		}
	};

	return (
			<div className={classes.tableContainer}>
				<div>
					<h2>State-wise Cases</h2>
				</div>
				<div className={classes.table_container + ' tableScroll'}>
					<table id="myTable">
						<thead>
							<tr className={classes.tblHeading}>
								<th>State/UT</th>
								<th>Confirmed</th>
								<th>Active</th>
								<th>Recovered</th>
								<th>Deceased</th>
							</tr>
						</thead>

						<tbody className={classes.tableBuilder}>
							{props.statewise_cases.map((item) => {
								if (!['TT', 'UN', 'DN'].includes(item.statecode))
									return (
										<tr
											onClick={rowClickHandler}
											data-statecode={item.statecode}
											data-isshow={false}
											onMouseOver={(ev) => props.onstateHover(ev)}
											key={item.statecode}
										>
											<td>
												<div className={classes.collapsableDiv}>
													<span className="arrow">
														<i
															className="fa fa-arrow-circle-o-right arrowicon"
															aria-hidden="true"
														></i>
													</span>
													<span className={classes.heading}>{item.state}</span>
												</div>
											</td>
											{tableDataGenerate(item,"deltaconfirmed","confirmed")}
											<td>{item.active}</td>
											{tableDataGenerate(item,"deltarecovered","recovered")}
											{tableDataGenerate(item,"deltadeaths","deaths")}
										</tr>
									);
							})}
						</tbody>
					</table>
				</div>
			</div>
		
	);
};

export default drilldowntable;
