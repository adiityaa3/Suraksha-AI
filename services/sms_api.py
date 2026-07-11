import os
import logging
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException

logger = logging.getLogger(__name__)

def send_farmer_alert(state, location, risk_level, target_phone):
    """
    Sends an SMS alert to a specific farmer's phone via Twilio.
    Returns (success_bool, message)
    """
    account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
    auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
    from_number = os.environ.get('TWILIO_PHONE_NUMBER')

    if not account_sid or not auth_token or not from_number:
        # Graceful fallback if Twilio is not configured
        return False, f"Twilio not configured. Would have sent: [Suraksha AI] {risk_level.upper()} RISK ALERT for {location}, {state.capitalize()}!"

    # Ensure phone number is valid
    if not target_phone.startswith('+'):
        return False, "Target phone number must include the country code (e.g. +919876543210)"

    client = Client(account_sid, auth_token)

    message_body = (
        f"🚨 SURAKSHA AI ALERT 🚨\n"
        f"Location: {location}, {state.capitalize()}\n"
        f"Risk Level: {risk_level.upper()}\n"
        f"Please take immediate precautionary measures. Stay safe."
    )

    try:
        message = client.messages.create(
            body=message_body,
            from_=from_number,
            to=target_phone
        )
        return True, f"Alert successfully dispatched via Twilio (Message SID: {message.sid})."
    except TwilioRestException as e:
        logger.error(f"Twilio error: {e}")
        return False, f"Twilio SMS delivery failed: {e.msg}"
    except Exception as e:
        logger.error(f"Failed to send SMS: {e}")
        return False, f"Failed to send SMS: {str(e)}"

def send_welcome_sms(name, state, location, target_phone):
    """
    Sends a welcome/confirmation SMS to a newly registered farmer.
    Returns (success_bool, message)
    """
    account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
    auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
    from_number = os.environ.get('TWILIO_PHONE_NUMBER')

    if not account_sid or not auth_token or not from_number:
        # Graceful fallback if Twilio is not configured
        return False, f"Twilio not configured. Would have sent: 🌱 Welcome to Suraksha AI, {name}! Registered for {location}, {state.capitalize()}."

    # Ensure phone number is valid
    if not target_phone.startswith('+'):
        return False, "Target phone number must include the country code (e.g. +919876543210)"

    client = Client(account_sid, auth_token)

    message_body = (
        f"🌱 Welcome to Suraksha AI, {name}!\n"
        f"You are now registered for hyperlocal climate alerts in {location}, {state.capitalize()}.\n"
        f"Stay safe and stay prepared."
    )

    try:
        message = client.messages.create(
            body=message_body,
            from_=from_number,
            to=target_phone
        )
        return True, f"Welcome SMS successfully dispatched (Message SID: {message.sid})."
    except TwilioRestException as e:
        logger.error(f"Twilio error: {e}")
        return False, f"Twilio SMS delivery failed: {e.msg}"
    except Exception as e:
        logger.error(f"Failed to send SMS: {e}")
        return False, f"Failed to send SMS: {str(e)}"

