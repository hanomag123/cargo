class FileInputController {
  container: HTMLElement;
  input: HTMLInputElement;
  // fileArea: HTMLElement;
  list: HTMLElement;
  fileTemplate: HTMLTemplateElement;
  files: File[];
  isRemove: boolean;
  event: Event;
  isMultiple: boolean;

  constructor(
    container: HTMLElement,
    input: HTMLInputElement,
    // fileArea: HTMLElement,
    list: HTMLElement,
    fileTemplate: HTMLTemplateElement,
  ) {
    this.container = container;
    this.input = input;
    // this.fileArea = fileArea;
    this.list = list;
    this.fileTemplate = fileTemplate;

    this.files = [];
    this.isRemove = false;
    this.isMultiple = this.input.multiple;

    // (this.fileArea as any).files = this.files;
    (this.input as any).fileList = this.files;

    this.input.addEventListener("change", this.inputHandler.bind(this));

    this.event = new Event("change", { bubbles: true });

    // this.fileArea.addEventListener(
    //   "dragenter",
    //   (e) => {
    //     e.preventDefault();
    //     this.fileArea.classList.add("focus");
    //   },
    //   false,
    // );
    // this.fileArea.addEventListener(
    //   "dragleave",
    //   (e) => {
    //     e.preventDefault();
    //     this.fileArea.classList.remove("focus");
    //   },
    //   false,
    // );
    // this.fileArea.addEventListener(
    //   "dragend",
    //   (e) => {
    //     e.preventDefault();
    //     this.fileArea.classList.remove("focus");
    //   },
    //   false,
    // );
    // this.fileArea.addEventListener(
    //   "dragover",
    //   (e) => {
    //     e.preventDefault();
    //     this.fileArea.classList.add("focus");
    //   },
    //   false,
    // );
    // this.fileArea.addEventListener(
    //   "drop",
    //   (e) => this.dropHandler.call(this, e),
    //   false,
    // );
  }

  inputHandler() {
    if (this.input.files) {
      if (this.isRemove) {
        this.files = [];
        const dt = new DataTransfer();

        for (let i = 0; i < this.input.files.length; i++) {
          const file = this.input.files[i];
          this.files.push(file);
        }

        this.files.forEach((file) => {
          dt.items.add(file);
        });

        this.input.files = dt.files;
      } else {
        if (!this.isMultiple) {
          this.files = [];
        }
        const dt = new DataTransfer();

        for (let i = 0; i < this.input.files.length; i++) {
          const file = this.input.files[i];
          this.files.push(file);
        }

        this.files.forEach((file) => {
          dt.items.add(file);
        });

        this.input.files = dt.files;
      }

      if (this.input.files.length > 0) {
        this.container.classList.add("_files");
      } else {
        this.container.classList.remove("_files");
      }
    }

    this.isRemove = false;
    this.render();
  }

  // dropHandler(e: DragEvent) {
  //   e.preventDefault();
  //   // this.fileArea.classList.remove("focus");

  //   const dt = e.dataTransfer;
  //   if (dt) {
  //     const files = dt.files;
  //     const types = this.input.accept.split(" ").join("").split(",");

  //     for (let i = 0; i < files.length; i++) {
  //       if (types.includes(files[i].type)) {
  //         this.files.push(files[i]);
  //       }
  //     }

  //     // (this.fileArea as any).files = this.files;
  //     (this.input as any).fileList = this.files;

  //     this.render();
  //   }
  // }

  removeFile(file: File) {
    const dt = new DataTransfer();
    this.files = this.files.filter((i) => i !== file);

    this.files.forEach((file) => {
      dt.items.add(file);
    });
    this.input.files = dt.files;

    this.isRemove = true;

    this.input.dispatchEvent(this.event);
    // this.render();
  }

  render() {
    const fragment = document.createDocumentFragment();

    this.files.forEach((file) => {
      const newNode = this.fileTemplate.content.children[0].cloneNode(true);

      const name = (newNode as HTMLElement).querySelector("[data-name]");
      const type = (newNode as HTMLElement).querySelector("[data-type]");
      const btn = (newNode as HTMLElement).querySelector<HTMLButtonElement>(
        "[data-btn]",
      );

      const fileNameArr = file.name.split(".");
      if (name) {
        name.textContent = fileNameArr
          .splice(0, fileNameArr.length - 1)
          .join(".");
      }

      if (type) {
        type.textContent = "." + fileNameArr[fileNameArr.length - 1];
      }

      if (btn) {
        btn.addEventListener("click", () => this.removeFile.call(this, file));
      }

      fragment.appendChild(newNode);
    });

    this.list.innerHTML = "";
    this.list.appendChild(fragment);
  }
}

export const initFileInputs = (wrapperSelector?: string) => {
  const list = document.querySelectorAll<HTMLElement>(
    `${wrapperSelector || ""} [data-file]`,
  );

  list.forEach((container) => {
    const input = container.querySelector<HTMLInputElement>("[data-input]");
    const list = container.querySelector<HTMLElement>("[data-list]");
    const template =
      container.querySelector<HTMLTemplateElement>("[data-template]");

    if (input && list && template) {
      new FileInputController(container, input, list, template);
    }
  });
};
