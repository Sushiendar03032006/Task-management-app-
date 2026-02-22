document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const tabBtns = document.querySelectorAll(".tabBtn");
    const progressBar = document.getElementById("progressBar");
    const progressPercent = document.getElementById("progressPercent");
    const taskCount = document.getElementById("taskCount");
    const taskInput = document.getElementById("taskInput");
    const addBtn = document.getElementById("addBtn");
    const taskList = document.getElementById("taskList");
    const logoutBtn = document.getElementById("logoutBtn");
    const themeToggle = document.getElementById("themeToggle");
    const userNameDisplay = document.getElementById("userNameDisplay");

    let currentFilter = "all";
    let searchQuery = "";
    let unsubscribe = null;
    let currentUser = null;

    /* ===========================
       THEME TOGGLE
    =========================== */
    themeToggle.onclick = () => {
        const body = document.body;
        body.classList.toggle("from-indigo-500");
        body.classList.toggle("from-slate-900");
        body.classList.toggle("via-purple-500");
        body.classList.toggle("via-slate-800");
        body.classList.toggle("to-pink-500");
        body.classList.toggle("to-slate-900");
        themeToggle.textContent = themeToggle.textContent === "🌙" ? "☀️" : "🌙";
    };

    /* ===========================
       AUTH & GREETING LOGIC
    =========================== */
    auth.onAuthStateChanged(user => {
        if (user) { 
            currentUser = user; 
            // Display the username saved in auth.js (displayName)
            userNameDisplay.textContent = user.displayName || user.email.split('@')[0];
            renderTasks(); 
        } else { 
            window.location.href = "index.html"; 
        }
    });

    logoutBtn.onclick = () => auth.signOut();

    addBtn.onclick = async () => {
        const val = taskInput.value.trim();
        if (!val) return;
        await db.collection("tasks").add({
            uid: currentUser.uid,
            text: val,
            completed: false,
            priority: "medium",
            dueDate: new Date().toISOString().split('T')[0],
            order: Date.now(),
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        taskInput.value = "";
    };

    function renderTasks() {
        if (unsubscribe) unsubscribe();

        unsubscribe = db.collection("tasks")
            .where("uid", "==", currentUser.uid)
            .orderBy("order")
            .onSnapshot(snapshot => {
                taskList.innerHTML = "";
                let total = 0, done = 0;
                let dateCounts = {}, priorityData = {};

                snapshot.forEach(doc => {
                    const data = doc.data();
                    total++;
                    if (data.completed) done++;

                    const dKey = data.dueDate || "No Date";
                    if (!dateCounts[dKey]) dateCounts[dKey] = { completed: 0, pending: 0 };
                    data.completed ? dateCounts[dKey].completed++ : dateCounts[dKey].pending++;

                    if (!priorityData[dKey]) priorityData[dKey] = { high: 0, medium: 0, low: 0 };
                    priorityData[dKey][data.priority || "medium"]++;

                    const matchesFilter = (currentFilter === "all") || (currentFilter === "active" && !data.completed) || (currentFilter === "completed" && data.completed);
                    if (matchesFilter && data.text.toLowerCase().includes(searchQuery)) {
                        const li = document.createElement("li");
                        const colors = { high: "bg-red-100 text-red-700", medium: "bg-amber-100 text-amber-700", low: "bg-blue-100 text-blue-700" };
                        
                        li.className = "flex items-center gap-4 p-5 bg-white rounded-2xl border shadow-sm transition hover:shadow-md";
                        li.innerHTML = `
                            <input type="checkbox" ${data.completed ? "checked" : ""} class="w-6 h-6 rounded-full cursor-pointer accent-indigo-600">
                            <div class="flex-1 text-left min-w-0">
                                <input type="text" value="${data.text}" class="w-full bg-transparent font-bold outline-none ${data.completed ? "line-through text-gray-400" : ""}">
                                <div class="flex items-center gap-2 mt-1">
                                    <input type="date" value="${data.dueDate}" class="date-edit text-[10px] font-black text-gray-400 bg-transparent border-none outline-none cursor-pointer">
                                    <span class="px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase ${colors[data.priority] || colors.medium}">${data.priority}</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-3 pl-4 border-l border-gray-50">
                                <select class="priority-select text-[10px] font-bold p-1 rounded bg-gray-50 outline-none">
                                    <option value="low" ${data.priority==="low"?"selected":""}>Low</option>
                                    <option value="medium" ${data.priority==="medium"?"selected":""}>Med</option>
                                    <option value="high" ${data.priority==="high"?"selected":""}>High</option>
                                </select>
                                <button class="delete-btn text-red-400 hover:text-red-600 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                                </button>
                            </div>`;
                        
                        li.querySelector("input[type=checkbox]").onchange = () => db.collection("tasks").doc(doc.id).update({ completed: !data.completed });
                        li.querySelector(".date-edit").onchange = (e) => db.collection("tasks").doc(doc.id).update({ dueDate: e.target.value });
                        li.querySelector(".priority-select").onchange = (e) => db.collection("tasks").doc(doc.id).update({ priority: e.target.value });
                        li.querySelector(".delete-btn").onclick = () => db.collection("tasks").doc(doc.id).delete();
                        taskList.appendChild(li);
                    }
                });

                const p = total === 0 ? 0 : Math.round((done / total) * 100);
                progressBar.style.width = p + "%";
                progressPercent.textContent = p + "%";
                taskCount.textContent = `${total} Tasks`;
                if(window.updateChart) window.updateChart(dateCounts, done, (total-done), priorityData);
                document.getElementById("emptyState").classList.toggle("hidden", snapshot.size > 0);
            });
    }

    /* EXPORT CSV LOGIC */
    document.getElementById("exportCsvBtn").onclick = async () => {
        const snap = await db.collection("tasks").where("uid", "==", currentUser.uid).get();
        if (snap.empty) return alert("No tasks to export!");
        let csv = "Task,Status,Priority,Due Date\n";
        snap.forEach(d => {
            const row = d.data();
            csv += `"${row.text}","${row.completed ? "Done" : "Pending"}","${row.priority}","${row.dueDate}"\n`;
        });
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Taskify_Report_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    tabBtns.forEach(btn => {
        btn.onclick = () => {
            currentFilter = btn.dataset.filter;
            tabBtns.forEach(b => {
                b.classList.toggle("bg-indigo-600", b === btn);
                b.classList.toggle("text-white", b === btn);
                b.classList.toggle("bg-gray-100", b !== btn);
            });
            renderTasks();
        };
    });

    searchInput.oninput = (e) => { searchQuery = e.target.value.toLowerCase(); renderTasks(); };

    document.getElementById("clearCompleted").onclick = async () => {
        const snap = await db.collection("tasks").where("uid", "==", currentUser.uid).where("completed", "==", true).get();
        const batch = db.batch();
        snap.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
    };
});