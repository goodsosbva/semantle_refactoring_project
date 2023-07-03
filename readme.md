# 시맨틀 — Vue.js 개선 프로젝트

이 레포지터리는 Johannes Gätjen의 [Semantlich](http://semantlich.johannesgaetjen.de/)
([소스코드](https://github.com/gaetjen/semantle-de))를 포크하여,
한국어로 플레이할 수 있도록 수정한 것을 다시 Vue.js로 개선한 프로젝트입니다.

 **한국어로 작업된 것을 다시 포크하여, 제 입맛에 맞는 Vue.js 개선 프로젝트를 소개합니다!!**
- - -
### Setup (환경 설정 작업 방법 소개)

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

- - -
### 꼬맨틀 개선 프로젝트 소개

* 꼬맨틀 개선프로젝트 코드 해당 저장소에서 보실 수 있습니다. 😎
* semantle_onBoarding/frontend/ 확인하실 수 있습니다. 😋
* 구체적으로 프로젝트의 목적과 의의는 아래의 ppt에 정리 해놨습니다. 🤗
* [개발_꼬맨틀 리팩토링 프로젝트2.pptx](https://github.com/goodsosbva/semantle_refactoring_project/files/10462838/_.2.pptx)





