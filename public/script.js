document.addEventListener("DOMContentLoaded", () => {
    const calendarGrid = document.getElementById("calendar-grid");
    const currentMonthDisplay = document.getElementById("current-month");
    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");
    const entryTextarea = document.getElementById("diary-entry");
    const saveButton = document.getElementById("save-button");
    const selectedDateDisplay = document.getElementById("selected-date");
    const notifyElement = document.getElementById('notify');
  
    let selectedDate = new Date();
    const showDate = document.getElementById('show-date')
    showDate.textContent=selectedDate.toLocaleDateString('en-IN')

    const fetchDates= async(date)=>{
      fetch('/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'date':date})
      })
        .then(async response => {
          if (!response.ok) {
            // Handle error if the response status is not OK (2xx)
          }else{
            const responseData=await response.json()
            colorCalendar(responseData.dates)
          }
        })
    }

    const colorCalendar= (dates)=>{
      dates.forEach((date)=>{
        document.getElementById(date).style.backgroundColor='rgba(0, 230, 5, 0.7)'
      })
    }
  
    const renderCalendar = async (date) => {
      calendarGrid.innerHTML = ""; // Clear existing dates
      const year = date.getFullYear();
      const month = date.getMonth();
      // Set current month display
      currentMonthDisplay.textContent = `${date.toLocaleString("default", { month: "long" })} ${year}`;
  
      // Get first and last day of the month
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
  
      // Add empty buttons for days before the first day of the month
      for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyButton = document.createElement("button");
        emptyButton.disabled = true;
        calendarGrid.appendChild(emptyButton);
      }
  
      // Add buttons for each day of the month
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayButton = document.createElement("button");
        dayButton.textContent = day;
        dayButton.id=day;
        dayButton.addEventListener("click", () => selectDate(new Date(year, month, day)));
        if (
          selectedDate.getDate() === day &&
          selectedDate.getMonth() === month &&
          selectedDate.getFullYear() === year
        ) {
          dayButton.classList.add("selected");
        }
        calendarGrid.appendChild(dayButton);
      }
      await fetchDates(date)
    };
  
    const selectDate = async(date) => {
      selectedDate = date;
      selectedDateDisplay.innerHTML = `Selected Date: <span>${date.toLocaleDateString('en-IN')}</span>`;
      fetch('/getdiary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'date':date})
      })
        .then(async response => {
          if (!response.ok) {
            // Handle error if the response status is not OK (2xx)
            notifyElement.textContent = "Network error... please try again";
            notifyElement.style.display = 'block';
            notifyElement.style.backgroundColor= 'rgba(255, 0, 0, 0.9)';
            setTimeout(() => {
              notifyElement.style.display = 'none';
            }, 5000);
            // throw new Error('Network response was not ok');
          }else{
            const responseData=await response.json()
            if(responseData.msg=="-1")
              entryTextarea.placeholder='Main khali hu... mujhe v bhar do naa ;)'
            else entryTextarea.value=responseData.content
            notifyElement.textContent = "fetched successfully...";
            notifyElement.style.display = 'block';
            notifyElement.style.backgroundColor= 'rgba(0, 230, 5, 0.7)';
            setTimeout(() => {
              notifyElement.style.display = 'none';
            }, 5000);
          }
        })
      

      entryTextarea.value = ""; // Clear the textarea for a new entry
      renderCalendar(selectedDate);
    };

    

    const saveEntry = () => {
      const entryText = entryTextarea.value.trim();
      if (entryText) {
        fetch('/savediary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({'content':entryText,'date':selectedDate})
        })
          .then(response => {
            if (!response.ok) {
              // Handle error if the response status is not OK (2xx)
              notifyElement.textContent = "Unable to save... please try again";
              notifyElement.style.display = 'block';
              notifyElement.style.backgroundColor= 'rgba(255, 0, 0, 0.9)';
              setTimeout(() => {
                notifyElement.style.display = 'none';
              }, 5000);
              // throw new Error('Network response was not ok');
            }else{
              notifyElement.textContent = "Saved Successfully";
              notifyElement.style.display = 'block';
              notifyElement.style.backgroundColor= 'rgba(0, 230, 5, 0.7)';
              setTimeout(() => {
                notifyElement.style.display = 'none';
              }, 5000);
            }
          })
      } else {
        notifyElement.textContent = "Please write something to save...";
        notifyElement.style.display = 'block';
        notifyElement.style.backgroundColor= 'rgba(90, 40, 75, 0.2)';
        setTimeout(() => {
          notifyElement.style.display = 'none';
        }, 5000);
      }
    };
  
    prevMonthBtn.addEventListener("click", () => {
      selectedDate.setMonth(selectedDate.getMonth() - 1);
      renderCalendar(selectedDate);
      selectDate(selectedDate)
    });
  
    nextMonthBtn.addEventListener("click", () => {
      selectedDate.setMonth(selectedDate.getMonth() + 1);
      renderCalendar(selectedDate);
      selectDate(selectedDate)
    });
  
    saveButton.addEventListener("click", saveEntry);
  
    // Initial render
    renderCalendar(selectedDate);
  });