extern crate webplatform;

fn main() {
    webplatform::init().element_query("#container").unwrap().html_set("Hello World");
}
