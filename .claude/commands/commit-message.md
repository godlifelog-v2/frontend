# Commit Message Recommendation & Work Summary Skill

Analyze current changes, recommend commit messages, and produce a structured markdown summary.

## Steps

### Step 1: Collect changes
Run the following commands in parallel:
- `git status` — list changed files
- `git diff HEAD` — show all staged + unstaged diffs
- `git log --oneline -5` — identify recent commit message style

### Step 2: Analyze changes
From the collected data, determine:
- Which files changed
- Purpose of the change (bug fix / new feature / refactor / config, etc.)
- Root cause or background

### Step 3: Recommend commit messages
Reference recent commit style and suggest Korean commit messages.

**Commit message format:**
```
{Type}: {summary of change}
```

**Type reference:**
| Type | Description |
|------|-------------|
| `Fix` | Bug fix |
| `Feat` | New feature |
| `Refactor` | Code improvement without behavior change |
| `Modify` | Partial change to existing behavior |
| `Chore` | Config, dependencies, misc |
| `Docs` | Documentation change |

Provide **2–3 candidates** with a brief reason for each.

Output example:
```
1. Fix: 루틴 활동명 입력 시 포커스 유실 문제 수정 ← 문제 원인을 직접 서술
2. Fix: ActivityNameInput 리렌더링으로 인한 포커스 초기화 수정 ← 기술적 원인 포함
```

### Step 4: Structured markdown summary
Output the work summary in the following format:

```markdown
## {Type}: {Work title}

### 문제 (버그 수정인 경우)
{Description of the problem}

### 원인
{Root cause analysis}

### 수정 / 변경 내용
{What was changed and how}

### 변경 파일
- `path/filename` — reason for change

### 참고
{Additional context, caveats, related items}
```

For features or refactors, replace "문제/원인" sections with "배경/목적".
