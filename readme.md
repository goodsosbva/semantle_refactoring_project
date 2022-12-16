# 꼬맨틀 — 단어 유사도 추측 게임

이 레포지터리는 Johannes Gätjen의 [Semantlich](http://semantlich.johannesgaetjen.de/)
([소스코드](https://github.com/gaetjen/semantle-de))를 포크하여,
한국어로 플레이할 수 있도록 수정한 것입니다.

### Setup

Download Word2Vec and dictionary data:

```bash
cd data
wget https://dl.fbaipublicfiles.com/fasttext/vectors-crawl/cc.ko.300.vec.gz
gzip -d cc.ko.300.vec.gz
wget https://github.com/spellcheck-ko/hunspell-dict-ko/releases/download/0.7.92/ko-aff-dic-0.7.92.zip
unzip ko-aff-dic-0.7.92.zip
```

Filter and save word2vec in DB

```bash
docker-compose run --rm --entrypoint python app filter_words.py
docker-compose run --rm --entrypoint python app process_vecs.py
```

(Optional) Regenerate secrets

```bash
docker-compose run --rm --entrypoint python app generate_secrets.py
```

Start server

```bash
docker-compose up
```

### 작업 일지

[WIP] Prepare new frontend

1. 꼬멘틀 입력에 따라 결과 테이블 추가 완료
2. 입력 오류처리 완료
3. 정답시 결과 페이지 팝업 완료
4. 컴포넌트 리팩토링 완료

[WIP] Prepare new frontend2

1. 꼬멘틀 각 요소당 정렬 완료
2. 지난 입력 데이터와 겹치지 않게 구현 (테스트 아직 못함)
3. 포기하기 버튼 누를시 결과창 팝업 구현 완
4. 성공시 결과창 팝업 구현 완
5. 결과창에 있는 데이터가 뜻에 맞게 결과값이 나오게 구현 완
6. 가장 마지막에 들어온 값 절취선으로 따로 두기 완료
7. 결과표에 막대그래프 생성 완료
8. 중복 인풋 안되게 설정 완료
9. 어제의 데이터가 남아있는 경우 이전 데이터 지우기 테스트 완료
