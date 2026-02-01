import sys
import json
import urllib.request
import urllib.error

def verify_get_estimations():
    url = "https://finfinphone.com/api-lucky/admin/price_estimation/get_price_estimations.php"

    try:
        print(f"Requesting: {url}")
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            status_code = response.getcode()
            print(f"Status Code: {status_code}")

            if status_code != 200:
                print("FAILED: Status code is not 200")
                return False

            data = response.read().decode('utf-8')
            try:
                json_data = json.loads(data)
                print(f"Successfully parsed JSON. Received {len(json_data)} records.")
                if len(json_data) > 0:
                    print("First record sample:")
                    print(json.dumps(json_data[0], indent=2, ensure_ascii=False))
                return True
            except json.JSONDecodeError as e:
                print(f"FAILED: Could not parse JSON. Error: {e}")
                print(f"Raw response: {data[:500]}...") # Print first 500 chars
                return False

    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.reason}")
        return False
    except urllib.error.URLError as e:
        print(f"URL Error: {e.reason}")
        return False
    except Exception as e:
        print(f"Unexpected Error: {e}")
        return False

if __name__ == "__main__":
    if verify_get_estimations():
        print("\n✅ Verification SUCCESS: Endpoint is reachable and returns valid JSON.")
    else:
        print("\n❌ Verification FAILED.")
