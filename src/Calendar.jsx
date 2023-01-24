'use strict';
const e = React.createElement;
import React from 'react';
import {format, startOfWeek, addDays, startOfDay, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths, parse, set} from 'date-fns' ;
import $ from 'jquery';

let selectedDays = [];
let price;
let multiplied;

function logSelected(){
  let selectedPackage = document.getElementById("packages").selectedIndex;
  let selectedValue = document.getElementsByTagName("option")[selectedPackage].value;
  if(selectedValue === 'RoomOnly'){
      let price = 44;
      multiplied = price*selectedDays.length;
      document.getElementById('total').innerHTML ="Total: $"+multiplied;
      localStorage.setItem('multiplied', multiplied);
     
  }
  else if(selectedValue === 'RoomRide'){
      let price = 89;
      multiplied = price*selectedDays.length;
      document.getElementById('total').innerHTML ="Total: $"+multiplied;
      localStorage.setItem('multiplied', multiplied);
  }
  else if(selectedValue === 'Tourist'){
      let price = 199;
      multiplied = price*selectedDays.length;
      document.getElementById('total').innerHTML ="Total: $"+multiplied;
      localStorage.setItem('multiplied', multiplied);
  }

 
  
}
const domContainer = document.querySelector('#calendar');
ReactDOM.render(e(Calendar), domContainer);

class Calendar extends React.Component{
    state = {
        currentMonth: new Date(),
        selectedDate: new Date()
    };
   
    renderHeader(){
        const dateFormat = "MMMM yyyy";
        return (
          <div className="header row flex-middle">
            <div className="col col-start">
              <div className="icon" onClick={this.prevMonth}>
                chevron_left
              </div>
            </div>
            <div className="col col-center">
              <span>{format(this.state.currentMonth, dateFormat)}</span>
            </div>
            <div className="col col-end" onClick={this.nextMonth}>
              <div className="icon">chevron_right</div>
            </div>
          </div>
        );
    }
    
    renderDays(){
        const dateFormat = "dddd";
        const days = [];
        let startDate = startOfWeek(this.state.currentMonth);
        for (let i = 0; i < 7; i++) {
          days.push(
            <div className="col col-center" key={i}>
              {format(addDays(startDate, i), dateFormat)}
            </div>
          );
        }
        return <div className="days row">{days}</div>;
    }

    renderCells(){
        const { currentMonth, selectedDate } = this.state;
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = "d";
        const rows = [];
    
        let days = [];
        let day = startDate;
        let formattedDate = "";
        
        let cells = document.getElementsByClassName('cell');
        while (day <= endDate) {
          for (let i = 0; i < 42; i++) {
            formattedDate = format(day, dateFormat);
            const cloneDay = day;
            let stringCloneDay = cloneDay.toString();
            days.push(
              <div
                className={`col cell ${
                  !isSameMonth(day, monthStart)
                    ? "disabled"
                    : isSameDay(day, selectedDate) ? "selected" : ""
                }`}
                id={formattedDate}
                key={day}
                // onClick={() => this.onDateClick(parse(cloneDay, formattedDate, selectedDate))}
                 onClick={()=> this.onDateClick(console.log(selectedDays.push(stringCloneDay.slice(0,15)), selectedDays, cells[i].classList.add('selected'), document.getElementById('showDates').innerHTML = 'Your Dates: '+selectedDays),
                 localStorage.setItem('selectedDates', selectedDays),logSelected(), 
                 
                 )}
              >
                <span className="number">{formattedDate}</span>
                <span className="bg" >{formattedDate}</span>
              </div>
            );
       
            day = addDays(day, 1);
            
          }
                  
          //  $('#'+formattedDate).addClass('selected'), console.log(day);
          rows.push(
            <div className="row" key={day}>
              {days}
            </div>
          );
          days = [];
          
        }
        return <div className="body">{rows}</div>;
    };
   
    onDateClick = day => {
        this.setState({
            selectedDate: day
        });
        
    };
    
    nextMonth = () => {
        this.setState({
            currentMonth: addMonths(this.state.currentMonth, 1)
        });
    };
    prevMonth = () => {
        this.setState({
            currentMonth: subMonths(this.state.currentMonth, 1)
        });
    };

    render(){
        return(
          <div>
            <h3>Now Select The Dates You Would Like to Stay with Us</h3>
            <div className="calendar">
                {this.renderHeader()}
                {this.renderDays()}
                {this.renderCells()}
            </div>
            <div id="showDates"></div>
            <div id="total"></div>         
          </div>    
        );
    }
    
}




export default Calendar;