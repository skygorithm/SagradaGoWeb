import axios from "axios";
import { API_URL } from "../Constants";

/**
 * Logging utility for admin actions
 * Automatically captures IP address and user agent
 */
class Logger {
  /**
   * Get client IP address (for logging purposes)
   */
  static getClientIP() {
    // In a real application, this would be handled by the backend
    // For now, we'll return null and let the backend handle it
    return null;
  }

  /**
   * Get user agent
   */
  static getUserAgent() {
    return navigator.userAgent || null;
  }

  /**
   * Get admin info from localStorage or session
   * Checks both "admin" and "currentUser" keys since SignInPage uses "currentUser"
   */
  static getAdminInfo() {
    try {
      let adminData = localStorage.getItem("admin");
      let admin = null;

      if (adminData) {
        admin = JSON.parse(adminData);

      } else {
        adminData = localStorage.getItem("currentUser");

        if (adminData) {
          const user = JSON.parse(adminData);
          const isAdminRoute = window.location.pathname && window.location.pathname.startsWith("/admin");
          if (isAdminRoute || user.is_admin === true || user.isAdmin === true) {
            admin = user;
          }
        }
      }

      if (admin) {
        return {
          id: admin._id || admin.id || null,
          name: admin.name || `${admin.first_name || ""} ${admin.last_name || ""}`.trim() || null,
          email: admin.email || null,
        };
      }

    } catch (error) {
      console.error("Error getting admin info:", error);
    }
    return { id: null, name: null, email: null };
  }

  /**
   * Create a log entry
   * @param {Object} logData - Log data
   * @param {string} logData.action - Action type (e.g., "CREATE_USER", "UPDATE_USER")
   * @param {string} logData.entity_type - Entity type (e.g., "USER", "ANNOUNCEMENT")
   * @param {string} logData.entity_id - Entity ID (optional)
   * @param {string} logData.entity_name - Entity name (optional)
   * @param {Object} logData.details - Additional details (optional)
   */
  static async log(logData) {
    try {
      const adminInfo = this.getAdminInfo();

      if (!adminInfo.id || !adminInfo.name) {
        console.warn("Cannot log: Admin info not found");
        return;
      }

      const payload = {
        action: logData.action,
        entity_type: logData.entity_type,
        entity_id: logData.entity_id || null,
        entity_name: logData.entity_name || null,
        admin_id: adminInfo.id,
        admin_name: adminInfo.name,
        admin_email: adminInfo.email,
        details: logData.details || {},
        ip_address: this.getClientIP(),
        user_agent: this.getUserAgent(),
      };

      axios.post(`${API_URL}/admin/createLog`, payload).catch((error) => {
        console.error("Failed to create log:", error);
      });

    } catch (error) {
      console.error("Error in logger:", error);
    }
  }

  /**
   * Helper methods for common actions
   */
  static async logCreateUser(userId, userName) {
    await this.log({
      action: "CREATE_USER",
      entity_type: "USER",
      entity_id: userId,
      entity_name: userName,
    });
  }

  static async logUpdateUser(userId, userName, details = {}) {
    await this.log({
      action: "UPDATE_USER",
      entity_type: "USER",
      entity_id: userId,
      entity_name: userName,
      details,
    });
  }

  static async logDisableUser(userId, userName) {
    await this.log({
      action: "DISABLE_USER",
      entity_type: "USER",
      entity_id: userId,
      entity_name: userName,
    });
  }

  static async logEnableUser(userId, userName) {
    await this.log({
      action: "ENABLE_USER",
      entity_type: "USER",
      entity_id: userId,
      entity_name: userName,
    });
  }

  static async logDeleteUser(userId, userName) {
    await this.log({
      action: "DELETE_USER",
      entity_type: "USER",
      entity_id: userId,
      entity_name: userName,
    });
  }

  static async logCreateAdmin(adminId, adminName) {
    await this.log({
      action: "CREATE_ADMIN",
      entity_type: "ADMIN",
      entity_id: adminId,
      entity_name: adminName,
    });
  }

  static async logCreateAnnouncement(announcementId, title) {
    await this.log({
      action: "CREATE_ANNOUNCEMENT",
      entity_type: "ANNOUNCEMENT",
      entity_id: announcementId,
      entity_name: title,
    });
  }

  static async logUpdateAnnouncement(announcementId, title) {
    await this.log({
      action: "UPDATE_ANNOUNCEMENT",
      entity_type: "ANNOUNCEMENT",
      entity_id: announcementId,
      entity_name: title,
    });
  }

  static async logDeleteAnnouncement(announcementId, title) {
    await this.log({
      action: "DELETE_ANNOUNCEMENT",
      entity_type: "ANNOUNCEMENT",
      entity_id: announcementId,
      entity_name: title,
    });
  }

  static async logCreateEvent(eventId, title) {
    await this.log({
      action: "CREATE_EVENT",
      entity_type: "EVENT",
      entity_id: eventId,
      entity_name: title,
    });
  }

  static async logUpdateEvent(eventId, title) {
    await this.log({
      action: "UPDATE_EVENT",
      entity_type: "EVENT",
      entity_id: eventId,
      entity_name: title,
    });
  }

  static async logDeleteEvent(eventId, title) {
    await this.log({
      action: "DELETE_EVENT",
      entity_type: "EVENT",
      entity_id: eventId,
      entity_name: title,
    });
  }

  static async logCreateBooking(bookingId, bookingType, details = {}) {
    await this.log({
      action: "CREATE_BOOKING",
      entity_type: "BOOKING",
      entity_id: bookingId,
      entity_name: `${bookingType} Booking`,
      details,
    });
  }

  static async logApproveBooking(bookingId, bookingType) {
    await this.log({
      action: "APPROVE_BOOKING",
      entity_type: "BOOKING",
      entity_id: bookingId,
      entity_name: `${bookingType} Booking`,
    });
  }

  static async logRejectBooking(bookingId, bookingType) {
    await this.log({
      action: "REJECT_BOOKING",
      entity_type: "BOOKING",
      entity_id: bookingId,
      entity_name: `${bookingType} Booking`,
    });
  }

  static async logUpdateBooking(bookingId, bookingType, details = {}) {
    await this.log({
      action: "UPDATE_BOOKING",
      entity_type: "BOOKING",
      entity_id: bookingId,
      entity_name: `${bookingType} Booking`,
      details,
    });
  }

  static async logDeleteBooking(bookingId, bookingType) {
    await this.log({
      action: "DELETE_BOOKING",
      entity_type: "BOOKING",
      entity_id: bookingId,
      entity_name: `${bookingType} Booking`,
    });
  }

  static async logGenerateReport(reportType, reportTitle, details = {}) {
    await this.log({
      action: "GENERATE_REPORT",
      entity_type: "REPORT",
      entity_id: null,
      entity_name: reportTitle || `${reportType} Report`,
      details: {
        report_type: reportType,
        ...details,
      },
    });
  }
}

export default Logger;

