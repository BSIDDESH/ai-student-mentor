import re

with open("main.py", "r", encoding="utf-8") as f:
    content = f.read()

old_block = '''DB_PATH = "profiles.json"
WEAK_THRESHOLD = 60


def _load_db() -> dict:
    if not os.path.exists(DB_PATH):
        return {}
    with open(DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_db(db: dict):
    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2)


def get_profile(user_id: str) -> Optional[dict]:
    return _load_db().get(user_id)


def save_profile(user_id: str, profile: dict):
    db = _load_db()
    db[user_id] = profile
    _save_db(db)'''

new_block = '''import boto3

WEAK_THRESHOLD = 60

dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
table = dynamodb.Table("StudentProfiles")


def get_profile(user_id: str) -> Optional[dict]:
    response = table.get_item(Key={"userId": user_id})
    return response.get("Item")


def save_profile(user_id: str, profile: dict):
    profile["userId"] = user_id
    table.put_item(Item=profile)'''

if old_block not in content:
    print("ERROR: old block not found exactly as expected. No changes made.")
    print("This means your file has slightly different spacing/text than assumed.")
else:
    content = content.replace(old_block, new_block)
    with open("main.py", "w", encoding="utf-8") as f:
        f.write(content)
    print("SUCCESS: main.py patched to use DynamoDB instead of local JSON file.")