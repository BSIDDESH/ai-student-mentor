import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="amazon.nova-pro-v1:0",
    max_tokens=300,
    messages=[{"role": "user", "content": "Explain fractions to a class 6 student using a chapati."}]
)

print(response.content[0].text)
