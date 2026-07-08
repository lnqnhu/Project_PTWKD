(() => {
    const API = "/api";
    const STATUS = {
        confirmed: "Đã xác nhận",
        preparing: "Đang chuẩn bị",
        delivering: "Đang giao",
        done: "Hoàn thành",
        cancelled: "Đã hủy"
    };
    const PAYMENT = {
        cod: "COD",
        bank_transfer: "Chuyển khoản",
        ewallet: "Ví điện tử",
        pending: "Chờ thanh toán",
        paid: "Đã thanh toán",
        failed: "Thất bại"
    };

    let token = localStorage.getItem("nutribaeAdminToken") || "";
    let adminUser = null;
    let toastTimer = null;

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => Array.from(document.querySelectorAll(selector));
    const formatVND = (value) => Number(value || 0).toLocaleString("vi-VN") + "đ";
    const formatDate = (date) => date ? new Date(date).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) : "—";
    const escapeHTML = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));

    function toast(message, isError = false) {
        const element = $("#toast");
        element.textContent = message;
        element.classList.toggle("error", isError);
        element.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => element.classList.remove("show"), 3200);
    }

    async function request(path, options = {}) {
        const headers = { ...(options.headers || {}) };
        if (token) headers.Authorization = `Bearer ${token}`;
        if (options.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";

        const response = await fetch(`${API}${path}`, { ...options, headers });
        let payload = {};
        try { payload = await response.json(); } catch (_) { /* no JSON body */ }

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) logout(true);
            throw new Error(payload.message || "Không thể xử lý yêu cầu");
        }
        return payload;
    }

    function setView(viewName) {
        const titles = { dashboard: "Dashboard Overview", orders: "Quản lý đơn hàng", customers: "Quản lý khách hàng" };
        $$(".view-section").forEach((view) => { view.hidden = view.id !== `${viewName}View`; });
        $$(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === viewName));
        $("#pageTitle").textContent = titles[viewName];
        if (viewName === "dashboard") loadDashboard();
        if (viewName === "orders") loadOrders();
        if (viewName === "customers") loadCustomers();
    }

    function openModal(title, html) {
        $("#modalTitle").textContent = title;
        $("#modalContent").innerHTML = html;
        $("#modalBackdrop").hidden = false;
    }

    function closeModal() {
        $("#modalBackdrop").hidden = true;
        $("#modalContent").innerHTML = "";
    }

    function statusBadge(status) {
        return `<span class="status-badge status-${status}">${STATUS[status] || escapeHTML(status)}</span>`;
    }

    function paymentBadge(paymentStatus) {
        return `<span class="pay-badge pay-${paymentStatus}">${PAYMENT[paymentStatus] || escapeHTML(paymentStatus)}</span>`;
    }

    function orderItemsText(items = []) {
        return items.map((item) => `${item.name}${item.qty > 1 ? ` ×${item.qty}` : ""}`).join(", ");
    }

    async function checkAdminSession() {
        if (!token) return false;
        try {
            const { user } = await request("/me");
            if (user.role !== "admin") throw new Error("Tài khoản không có quyền quản trị");
            adminUser = user;
            $("#adminName").textContent = user.fullName;
            $("#adminLoginView").hidden = true;
            $("#adminApp").hidden = false;
            await loadDashboard();
            return true;
        } catch (error) {
            localStorage.removeItem("nutribaeAdminToken");
            token = "";
            return false;
        }
    }

    async function login(event) {
        event.preventDefault();
        const button = event.submitter;
        const message = $("#loginMessage");
        message.textContent = "";
        button.disabled = true;
        button.textContent = "Đang đăng nhập...";
        try {
            const email = $("#adminEmail").value.trim();
            const password = $("#adminPassword").value;
            const response = await fetch(`${API}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Đăng nhập thất bại");
            if (data.user.role !== "admin") throw new Error("Tài khoản này không có quyền Admin");

            token = data.token;
            adminUser = data.user;
            localStorage.setItem("nutribaeAdminToken", token);
            $("#adminName").textContent = adminUser.fullName;
            $("#adminLoginView").hidden = true;
            $("#adminApp").hidden = false;
            await loadDashboard();
        } catch (error) {
            message.textContent = error.message;
        } finally {
            button.disabled = false;
            button.textContent = "Đăng nhập Admin";
        }
    }

    function logout(silent = false) {
        localStorage.removeItem("nutribaeAdminToken");
        token = "";
        adminUser = null;
        $("#adminApp").hidden = true;
        $("#adminLoginView").hidden = false;
        if (!silent) toast("Bạn đã đăng xuất");
    }

    async function loadDashboard() {
        try {
            const { summary, recentOrders } = await request("/admin/dashboard");
            $("#totalOrders").textContent = summary.totalOrders || 0;
            $("#totalCustomers").textContent = summary.totalCustomers || 0;
            $("#processingOrders").textContent = (summary.statusCounts.confirmed || 0) + (summary.statusCounts.preparing || 0);
            $("#deliveringOrders").textContent = summary.statusCounts.delivering || 0;
            $("#totalRevenue").textContent = formatVND(summary.totalRevenue);

            const tbody = $("#recentOrdersBody");
            tbody.innerHTML = recentOrders.length ? recentOrders.map((order) => `
                <tr>
                    <td><strong>#${escapeHTML(order.orderCode)}</strong></td>
                    <td>${escapeHTML(order.customer.fullName)}<small>${escapeHTML(order.customer.phone)}</small></td>
                    <td>${formatVND(order.total)}</td>
                    <td>${statusBadge(order.status)}</td>
                    <td>${formatDate(order.createdAt)}</td>
                </tr>
            `).join("") : '<tr><td colspan="5" class="empty-row">Chưa có đơn hàng nào trong hệ thống.</td></tr>';
        } catch (error) { toast(error.message, true); }
    }

    async function loadOrders() {
        try {
            const search = $("#orderSearch").value.trim();
            const status = $("#orderStatusFilter").value;
            const query = new URLSearchParams();
            if (search) query.set("search", search);
            if (status) query.set("status", status);
            const { orders } = await request(`/admin/orders?${query.toString()}`);
            const tbody = $("#ordersBody");
            tbody.innerHTML = orders.length ? orders.map((order) => `
                <tr>
                    <td><strong>#${escapeHTML(order.orderCode)}</strong><small>${formatDate(order.createdAt)}</small></td>
                    <td>${escapeHTML(order.customer.fullName)}<small>${escapeHTML(order.customer.phone)}</small></td>
                    <td title="${escapeHTML(orderItemsText(order.items))}">${escapeHTML(orderItemsText(order.items).slice(0, 42))}${orderItemsText(order.items).length > 42 ? "…" : ""}<small>${order.items.length} mục</small></td>
                    <td><strong>${formatVND(order.total)}</strong></td>
                    <td>${PAYMENT[order.paymentMethod]}<small>${paymentBadge(order.paymentStatus)}</small></td>
                    <td>${statusBadge(order.status)}</td>
                    <td><button class="table-action" data-order-id="${order.id}">Xem / cập nhật</button></td>
                </tr>
            `).join("") : '<tr><td colspan="7" class="empty-row">Không tìm thấy đơn hàng phù hợp.</td></tr>';
            $$("[data-order-id]").forEach((button) => button.addEventListener("click", () => openOrderModal(orders.find((order) => order.id === button.dataset.orderId))));
        } catch (error) { toast(error.message, true); }
    }

    function openOrderModal(order) {
        if (!order) return;
        const itemRows = order.items.map((item) => `<li><strong>${escapeHTML(item.name)}</strong> × ${item.qty} — ${formatVND(item.price * item.qty)}</li>`).join("");
        const options = Object.entries(STATUS).map(([value, label]) => `<option value="${value}" ${order.status === value ? "selected" : ""}>${label}</option>`).join("");
        const paymentOptions = ["pending", "paid", "failed"].map((value) => `<option value="${value}" ${order.paymentStatus === value ? "selected" : ""}>${PAYMENT[value]}</option>`).join("");
        openModal(`Đơn hàng #${order.orderCode}`, `
            <div class="modal-body">
                <div class="detail-grid">
                    <div class="detail-box"><p>Khách hàng</p><strong>${escapeHTML(order.customer.fullName)}</strong></div>
                    <div class="detail-box"><p>Liên hệ</p><strong>${escapeHTML(order.customer.phone)}</strong></div>
                    <div class="detail-box full"><p>Địa chỉ</p><strong>${escapeHTML(order.customer.address)}</strong></div>
                    <div class="detail-box"><p>Phương thức</p><strong>${PAYMENT[order.paymentMethod]}</strong></div>
                    <div class="detail-box"><p>Tổng tiền</p><strong>${formatVND(order.total)}</strong></div>
                </div>
                <h3 class="section-title">Sản phẩm đã đặt</h3>
                <ul class="order-items-list">${itemRows}</ul>
                <h3 class="section-title">Cập nhật đơn hàng</h3>
                <div class="field-grid">
                    <label>Trạng thái đơn<select id="modalOrderStatus" class="status-select">${options}</select></label>
                    <label>Thanh toán<select id="modalPaymentStatus" class="status-select">${paymentOptions}</select></label>
                    <label class="full">Ghi chú (không bắt buộc)<input id="modalOrderNote" placeholder="Ví dụ: Kitchen started preparing the order"></label>
                </div>
                <div class="modal-actions"><button id="saveOrderBtn" class="primary-btn">Lưu cập nhật</button></div>
            </div>
        `);
        $("#saveOrderBtn").addEventListener("click", async () => {
            const button = $("#saveOrderBtn");
            button.disabled = true;
            try {
                await request(`/admin/orders/${order.id}/status`, {
                    method: "PUT",
                    body: JSON.stringify({ status: $("#modalOrderStatus").value, paymentStatus: $("#modalPaymentStatus").value, note: $("#modalOrderNote").value })
                });
                closeModal();
                toast("Đã cập nhật đơn hàng");
                await Promise.all([loadOrders(), loadDashboard()]);
            } catch (error) { toast(error.message, true); }
            finally { button.disabled = false; }
        });
    }

    async function loadCustomers() {
        try {
            const search = $("#customerSearch").value.trim();
            const query = search ? `?search=${encodeURIComponent(search)}` : "";
            const { users } = await request(`/admin/users${query}`);
            const tbody = $("#customersBody");
            tbody.innerHTML = users.length ? users.map((user) => {
                const profile = user.profile || {};
                const body = [profile.age ? `${profile.age} tuổi` : "", profile.height ? `${profile.height}cm` : "", profile.weight ? `${profile.weight}kg` : ""].filter(Boolean).join(" · ") || "Chưa cập nhật";
                return `<tr>
                    <td><strong>${escapeHTML(user.fullName)}</strong></td>
                    <td>${escapeHTML(user.email)}</td>
                    <td>${escapeHTML(profile.goal || "Chưa cập nhật")}</td>
                    <td>${escapeHTML(body)}<small>${profile.targetCalories ? `${profile.targetCalories} kcal/ngày` : ""}</small></td>
                    <td>${formatDate(user.createdAt)}</td>
                    <td><button class="table-action" data-customer-id="${user.id}">Xem / chỉnh sửa</button></td>
                </tr>`;
            }).join("") : '<tr><td colspan="6" class="empty-row">Không tìm thấy khách hàng phù hợp.</td></tr>';
            $$("[data-customer-id]").forEach((button) => button.addEventListener("click", () => openCustomerModal(button.dataset.customerId)));
        } catch (error) { toast(error.message, true); }
    }

    async function openCustomerModal(userId) {
        try {
            const { user, orders } = await request(`/admin/users/${userId}`);
            const profile = user.profile || {};
            const recentOrders = orders.length ? orders.slice(0, 5).map((order) => `<li>#${escapeHTML(order.orderCode)} — ${formatVND(order.total)} — ${STATUS[order.status]}</li>`).join("") : "<li>Khách hàng chưa có đơn hàng.</li>";
            openModal(`Khách hàng: ${user.fullName}`, `
                <div class="modal-body">
                    <form id="customerForm">
                        <div class="field-grid">
                            <label>Họ và tên<input name="fullName" value="${escapeHTML(user.fullName)}" required></label>
                            <label>Email<input name="email" type="email" value="${escapeHTML(user.email)}" required></label>
                            <label>Mục tiêu<select name="goal"><option value="">Chưa chọn</option>${["lose_weight", "gain_weight", "gain_muscle", "maintain", "eat_clean"].map((goal) => `<option value="${goal}" ${profile.goal === goal ? "selected" : ""}>${goal}</option>`).join("")}</select></label>
                            <label>Giới tính<select name="gender"><option value="">Chưa chọn</option><option value="female" ${profile.gender === "female" ? "selected" : ""}>Nữ</option><option value="male" ${profile.gender === "male" ? "selected" : ""}>Nam</option><option value="other" ${profile.gender === "other" ? "selected" : ""}>Khác</option></select></label>
                            <label>Tuổi<input name="age" type="number" min="1" value="${profile.age ?? ""}"></label>
                            <label>Chiều cao (cm)<input name="height" type="number" min="1" value="${profile.height ?? ""}"></label>
                            <label>Cân nặng (kg)<input name="weight" type="number" min="1" step="0.1" value="${profile.weight ?? ""}"></label>
                            <label>Mức vận động<select name="activityLevel"><option value="">Chưa chọn</option>${[["sedentary","Ít vận động"],["light","Nhẹ"],["moderate","Vừa"],["active","Nhiều"]].map(([value,label]) => `<option value="${value}" ${profile.activityLevel === value ? "selected" : ""}>${label}</option>`).join("")}</select></label>
                        </div>
                        <p class="modal-note">Mục tiêu calories và macros sẽ được hệ thống tính lại khi chỉ số cơ thể đầy đủ.</p>
                        <div class="modal-actions"><button class="primary-btn" type="submit">Lưu thông tin khách hàng</button></div>
                    </form>
                    <h3 class="section-title">Lịch sử đơn hàng gần đây</h3>
                    <ul class="order-items-list">${recentOrders}</ul>
                </div>
            `);
            $("#customerForm").addEventListener("submit", async (event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                const button = event.submitter;
                button.disabled = true;
                try {
                    const profilePayload = {
                        goal: form.get("goal"), gender: form.get("gender"), age: form.get("age"), height: form.get("height"), weight: form.get("weight"), activityLevel: form.get("activityLevel")
                    };
                    await request(`/admin/users/${user.id}`, {
                        method: "PUT",
                        body: JSON.stringify({ fullName: form.get("fullName"), email: form.get("email"), profile: profilePayload })
                    });
                    closeModal();
                    toast("Đã cập nhật thông tin khách hàng");
                    await Promise.all([loadCustomers(), loadDashboard()]);
                } catch (error) { toast(error.message, true); }
                finally { button.disabled = false; }
            });
        } catch (error) { toast(error.message, true); }
    }

    function debounce(callback, delay = 350) {
        let timer;
        return (...args) => { clearTimeout(timer); timer = setTimeout(() => callback(...args), delay); };
    }

    function bindEvents() {
        $("#adminLoginForm").addEventListener("submit", login);
        $("#logoutBtn").addEventListener("click", () => logout());
        $("#modalCloseBtn").addEventListener("click", closeModal);
        $("#modalBackdrop").addEventListener("click", (event) => { if (event.target.id === "modalBackdrop") closeModal(); });
        $$(".nav-item").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
        $$("[data-goto]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.goto)));
        $("#refreshBtn").addEventListener("click", () => {
            const active = $(".nav-item.active")?.dataset.view || "dashboard";
            setView(active);
        });
        $("#orderStatusFilter").addEventListener("change", loadOrders);
        $("#orderSearch").addEventListener("input", debounce(loadOrders));
        $("#customerSearch").addEventListener("input", debounce(loadCustomers));
    }

    document.addEventListener("DOMContentLoaded", async () => {
        bindEvents();
        await checkAdminSession();
    });
})();
