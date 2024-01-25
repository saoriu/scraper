FROM amazon/aws-sam-cli-build-image-python3.9

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt -t .