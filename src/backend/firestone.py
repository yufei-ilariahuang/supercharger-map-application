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
'''
Return: List of Links to each store
'''
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

'''
Args: a Selenium WebDriver instance as an argument 
Return: List of location datas
'''
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
'''
scraping of Tesla locations
collects all the data
writes it into Firestone
'''
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
'''
 Takes the scraped data and uploads each item to Firebase Firestore
 organizing data by location in the database
 Args:  scraped data
'''
def upload_to_firestore(data):
    db = firestore.client()
    current_collection_name = None
    
    for entry in data:
        if 'title' in entry:
            # Normalize the title to use as a collection name
            current_collection_name = entry['title'].replace(' - ', '_').replace(' ', '_')
        elif current_collection_name and 'location' in entry:
            # Only attempt to create documents within a known collection and if 'location' is present
            collection_ref = db.collection(current_collection_name)
            doc_ref = collection_ref.document(entry['location'].replace('/', '_').replace(' ', '_'))  # Normalize document ID
            doc_ref.set(entry)
        else:
            print(f"Skipping entry, missing required data or collection name: {entry}")


if __name__ == "__main__":
    load_dotenv()  # Load environment variables from .env file
    print(os.getenv('GOOGLE_APPLICATION_CREDENTIALS'))  # Should print the path to your JSON file

# Get the path from an environment variable
    key_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    cred = credentials.Certificate(key_path)
    firebase_admin.initialize_app(cred)
    scrape_and_upload_to_firestore()
