import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from dotenv import load_dotenv
import os
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException


def scrape_tesla_infos(driver):
    # Wait for the page to load completely
    try:
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'h1')))
        print("Page loaded successfully.")
    except TimeoutError:
        print("Page load timed out.")

    # Extract title
    try:
        # Extract title
        titles = driver.find_element(By.XPATH, '/html/body/section/div/div/header/h1')
    except NoSuchElementException:
        print("Title element not found. Skipping this section.")
        return []


    # Find all links and corresponding addresses
    locations = driver.find_elements(By.CSS_SELECTOR, 'a[href*="/findus/location"]')
    addresses = driver.find_elements(By.CSS_SELECTOR, '.street-address-states')
    postals = driver.find_elements(By.CSS_SELECTOR, '.locality-city-postal')

    # Store the extracted information in a list of dictionaries
    dict = [{"title": titles.text}]

    for location, address, postal in zip(locations, addresses, postals):
        info = {
            "location": location.text,
            "url": location.get_attribute('href'),
            "address": address.text,
            "postal": postal.text
        }
        dict.append(info)

    return dict

def scrape_tesla_locations():
    # Set up the Chrome WebDriver
    options = webdriver.ChromeOptions()
    options.add_experimental_option('excludeSwitches', ['enable-automation'])
    driver = webdriver.Chrome(options=options)
    
    # Open the main page
    driver.get('https://www.tesla.com/findus/list')
    try:
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'h1')))
        print("Page loaded successfully.")
    except TimeoutError:
        print("Page load timed out.")

    # Find all the locations' links
    all_links = driver.find_elements(By.XPATH, '//a')
    base_url = 'https://www.tesla.com/findus/list/'
    desired_links = []
    for link in all_links:
        if base_url in link.get_attribute('href'):
            desired_links.append(link.get_attribute('href'))

    driver.quit()

    return desired_links

def scrape_and_write_to_json():
    desired_links = scrape_tesla_locations()
    all_data = []

    # Set up the Chrome WebDriver
    options = webdriver.ChromeOptions()
    options.add_experimental_option('excludeSwitches', ['enable-automation'])
    driver = webdriver.Chrome(options=options)

    for link in desired_links:
        driver.get(link)
        single_web = scrape_tesla_infos(driver)
        all_data.extend(single_web)

    driver.quit()

    # Write the data to a JSON file
    with open('tesla_location_dataset.json', 'w') as f:
        json.dump(all_data, f, indent=4)

# if __name__ == "__main__":
#     scrape_and_write_to_json()


load_dotenv()  # Load environment variables from .env file
print(os.getenv('GOOGLE_APPLICATION_CREDENTIALS'))  # Should print the path to your JSON file

# Get the path from an environment variable
key_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
cred = credentials.Certificate(key_path)
firebase_admin.initialize_app(cred)


def upload_to_firestore(data):
    db = firestore.client()
    for item in data:
        # Assuming each item has a unique identifier under 'location'
        doc_ref = db.collection('superchargers').document(item['location'])
        doc_ref.set(item)

def scrape_and_upload_to_firestore():
    desired_links = scrape_tesla_locations()
    all_data = []

    options = webdriver.ChromeOptions()
    options.add_experimental_option('excludeSwitches', ['enable-automation'])
    driver = webdriver.Chrome(options=options)

    for link in desired_links:
        driver.get(link)
        single_web = scrape_tesla_infos(driver)
        all_data.extend(single_web)

    driver.quit()

    # Upload data to Firestore
    upload_to_firestore(all_data)

# if __name__ == "__main__":
#     scrape_and_upload_to_firestore()
