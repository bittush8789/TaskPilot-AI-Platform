"""
TaskPilot AI - Agentic Orchestration Layer
This module defines the specialized AI tools and the intelligent routing logic.
Prompts are decoupled from code and loaded from a centralized YAML configuration.
"""

import os
import yaml
from functools import lru_cache
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv

# Initialize configurations
load_dotenv()

# --- LLM Initialization (Singleton Pattern) ---

# The Gemini 2.5 Flash model is chosen for its high speed and low latency.
api_key = os.getenv("GEMINI_API_KEY")
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", 
    temperature=0.7, 
    google_api_key=api_key
)

# --- Prompt Management (LLMOps Best Practices) ---

@lru_cache()
def get_cached_prompts():
    """
    Reads prompt templates from disk once and caches them in memory.
    This prevents repeated disk I/O, significantly speeding up every AI request.
    """
    prompt_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "prompts", "prompts.yaml")
    with open(prompt_path, "r") as f:
        return yaml.safe_load(f)["prompts"]

async def get_tool_response(tool_key: str, **kwargs) -> str:
    """
    Generic wrapper to load a prompt template, format it, and call the LLM asynchronously.
    
    Args:
        tool_key (str): The key in prompts.yaml (e.g., 'resume_analyzer').
        **kwargs: Variables to inject into the prompt template.
    """
    prompts = get_cached_prompts()
    template = prompts[tool_key]["template"]
    prompt = PromptTemplate.from_template(template)
    
    # ainvoke is the asynchronous version of LangChain's call mechanism
    response = await llm.ainvoke(prompt.format(**kwargs))
    return response.content

# --- Specialized AI Tools ---

async def analyze_resume_tool(text: str) -> str:
    """Provides ATS scoring and improvement feedback for resumes."""
    return await get_tool_response("resume_analyzer", text=text)

async def devops_generator_tool(requirement: str) -> str:
    """Generates Docker, K8s, and CI/CD configurations based on user needs."""
    return await get_tool_response("devops_generator", requirement=requirement)

async def daily_planner_tool(goals: str) -> str:
    """Creates a smart, prioritized daily schedule based on provided goals."""
    return await get_tool_response("daily_planner", goals=goals)

async def notes_summarizer_tool(text: str) -> str:
    """Condenses long text into bulleted summaries and key takeaways."""
    return await get_tool_response("notes_summarizer", text=text)

async def blog_writer_tool(topic: str) -> str:
    """Generates SEO-optimized blog content with metadata and hashtags."""
    return await get_tool_response("blog_writer", topic=topic)

async def interview_questions_tool(role: str) -> str:
    """Generates Technical and HR interview questions for a specific job role."""
    return await get_tool_response("interview_questions", role=role)

async def code_helper_tool(query: str) -> str:
    """General coding assistant for debugging and script generation."""
    return await get_tool_response("code_helper", query=query)

# --- Intelligent Agent Router ---

async def route_and_execute(user_input: str) -> tuple[str, str]:
    """
    Analyzes user intent using the LLM and delegates to the most appropriate specialized tool.
    This implementation uses O(1) dictionary mapping for efficiency.
    
    Returns:
        tuple[str, str]: (Name of the tool used, The generated AI output)
    """
    prompts = get_cached_prompts()
    routing_template = prompts["router"]["template"]
    routing_prompt = PromptTemplate.from_template(routing_template)
    
    # First LLM call: Determine the intent
    routing_response = await llm.ainvoke(routing_prompt.format(input=user_input))
    tool_name = routing_response.content.strip()
    
    # Map model responses to local function calls
    tool_map = {
        "Resume Analyzer": analyze_resume_tool,
        "DevOps Generator": devops_generator_tool,
        "Daily Planner": daily_planner_tool,
        "Notes Summarizer": notes_summarizer_tool,
        "Blog Writer": blog_writer_tool,
        "Interview Questions": interview_questions_tool,
    }

    # Iterate through map keys to find a match (allowing for slight model variations)
    for key, tool_func in tool_map.items():
        if key in tool_name:
            return key, await tool_func(user_input)
            
    # Default fallback if no specific tool is identified
    return "Code Helper", await code_helper_tool(user_input)
